import { error, redirect } from '@sveltejs/kit'
import {
	id,
	text,
	number,
	checkbox,
	file,
	oneOf,
	failMessage,
	failWith,
	storagePath,
	signedUrls
} from '#lib/server/form.js'
import { MOODBOARD_ITEM_TYPES } from '#lib/utils/constants.js'

const BUCKET = 'moodboards'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { supabase } = locals
	const [{ data: board }, { data }, { data: projects }] = await Promise.all([
		supabase
			.from('moodboards')
			.select('id, title, project_id, visible_to_client')
			.eq('id', params.id)
			.maybeSingle(),
		supabase
			.from('moodboard_items')
			.select('id, type, content, image_path, x, y, width, height')
			.eq('moodboard_id', params.id)
			.order('z_index'),
		supabase.from('projects').select('id, title').neq('status', 'archived').order('title')
	])
	if (!board) error(404, 'Moodboard not found')

	const items = data ?? []
	const urls = await signedUrls(
		supabase,
		BUCKET,
		items.map(({ image_path }) => image_path)
	)

	return {
		board,
		items: items.map(({ image_path, ...item }) => ({
			...item,
			imageUrl: image_path ? (urls[image_path] ?? null) : null
		})),
		projects: (projects ?? []).map(({ id: projectId, title }) => ({
			value: projectId,
			label: title
		}))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const { error: updateError } = await locals.supabase
			.from('moodboards')
			.update({
				title: text(formData, 'title') ?? 'Moodboard',
				project_id: text(formData, 'project_id'),
				visible_to_client: checkbox(formData, 'visible_to_client')
			})
			.eq('id', params.id)
		if (updateError) return failWith(updateError)
		return { success: 'Saved.' }
	},

	addItem: async ({ request, locals, params }) => {
		const { supabase, user } = locals
		const formData = await request.formData()
		const type = oneOf(text(formData, 'type'), MOODBOARD_ITEM_TYPES, 'text')

		const image = type === 'image' ? file(formData, 'image') : null
		if (type === 'image' && !image) return failMessage('Choose an image.')
		const imagePath = image
			? storagePath(user?.id ?? '', ['moodboards', params.id], image.name)
			: null
		if (image && imagePath) {
			const { error: uploadError } = await supabase.storage
				.from(BUCKET)
				.upload(imagePath, image, { contentType: image.type })
			if (uploadError) return failWith(uploadError)
		}

		const { count } = await supabase
			.from('moodboard_items')
			.select('id', { count: 'exact', head: true })
			.eq('moodboard_id', params.id)
		const { error: insertError } = await supabase.from('moodboard_items').insert({
			moodboard_id: params.id,
			type,
			content: text(formData, 'content'),
			image_path: imagePath,
			x: number(formData, 'x') ?? 0,
			y: number(formData, 'y') ?? 0,
			width: number(formData, 'width'),
			height: number(formData, 'height'),
			z_index: count ?? 0
		})
		if (insertError) return failWith(insertError)
	},

	deleteItem: async ({ request, locals }) => {
		const { supabase } = locals
		const itemId = id(await request.formData())
		const { data: row } = await supabase
			.from('moodboard_items')
			.select('image_path')
			.eq('id', itemId)
			.single()

		const { error: deleteError } = await supabase.from('moodboard_items').delete().eq('id', itemId)
		if (deleteError) return failWith(deleteError)
		if (row?.image_path) await supabase.storage.from(BUCKET).remove([row.image_path])
	},

	delete: async ({ locals, params }) => {
		const { supabase } = locals
		const { data: items } = await supabase
			.from('moodboard_items')
			.select('image_path')
			.eq('moodboard_id', params.id)

		const { error: deleteError } = await supabase.from('moodboards').delete().eq('id', params.id)
		if (deleteError) return failWith(deleteError)

		const paths = (items ?? []).map(({ image_path }) => image_path).filter((path) => path !== null)
		if (paths.length) await supabase.storage.from(BUCKET).remove(paths)
		redirect(303, '/moodboards')
	}
}

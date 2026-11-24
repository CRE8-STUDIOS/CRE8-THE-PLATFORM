import {
	id,
	text,
	number,
	file,
	failMessage,
	failWith,
	storagePath,
	signedUrls
} from '#lib/server/form.js'

const BUCKET = 'tile-icons'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase } = locals
	const { data } = await supabase
		.from('dashboard_tiles')
		.select('id, name, url, icon_path, group_name, position')
		.order('position')
	const tiles = data ?? []
	const urls = await signedUrls(
		supabase,
		BUCKET,
		tiles.map(({ icon_path }) => icon_path)
	)

	return {
		tiles: tiles.map(({ icon_path, ...tile }) => ({
			...tile,
			iconUrl: icon_path ? (urls[icon_path] ?? null) : null
		}))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals }) => {
		const { supabase, user } = locals
		const formData = await request.formData()
		const name = text(formData, 'name')
		const url = text(formData, 'url')
		if (!name || !url) return failMessage('Fill in a name and a link.')

		const icon = file(formData, 'icon')
		const iconPath = icon ? storagePath(user?.id ?? '', ['icons'], icon.name) : null
		if (icon && iconPath) {
			const { error: uploadError } = await supabase.storage
				.from(BUCKET)
				.upload(iconPath, icon, { contentType: icon.type })
			if (uploadError) return failWith(uploadError)
		}

		const { error } = await supabase.from('dashboard_tiles').insert({
			name,
			url,
			icon_path: iconPath,
			group_name: text(formData, 'group_name'),
			position: number(formData, 'position') ?? 0
		})
		if (error) return failWith(error)
		return { success: 'App button added.' }
	},

	delete: async ({ request, locals }) => {
		const { supabase } = locals
		const tileId = id(await request.formData())
		const { data: row } = await supabase
			.from('dashboard_tiles')
			.select('icon_path')
			.eq('id', tileId)
			.single()

		const { error } = await supabase.from('dashboard_tiles').delete().eq('id', tileId)
		if (error) return failWith(error)
		if (row?.icon_path) await supabase.storage.from(BUCKET).remove([row.icon_path])
		return { success: 'Removed.' }
	}
}

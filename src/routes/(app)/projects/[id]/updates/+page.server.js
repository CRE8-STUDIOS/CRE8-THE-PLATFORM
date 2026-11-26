import { id, text, checkbox, failMessage, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { data: updates } = await locals.supabase
		.from('project_updates')
		.select('id, title, body, created_at, visible_to_client')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false })

	return { updates: updates ?? [] }
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const title = text(formData, 'title')
		if (!title) return failMessage('Give the update a title.')

		const { error } = await locals.supabase.from('project_updates').insert({
			project_id: params.id,
			title,
			body: text(formData, 'body'),
			visible_to_client: checkbox(formData, 'visible_to_client')
		})
		if (error) return failWith(error)
		return { success: 'Update posted.' }
	},

	toggle: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error } = await locals.supabase
			.from('project_updates')
			.update({ visible_to_client: checkbox(formData, 'visible') })
			.eq('id', id(formData))
		if (error) return failWith(error)
		return { success: 'Updated.' }
	},

	delete: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('project_updates')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Deleted.' }
	}
}

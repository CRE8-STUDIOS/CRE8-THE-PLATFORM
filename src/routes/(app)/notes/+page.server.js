import { id, text, failMessage, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase } = locals
	const projectId = url.searchParams.get('project')
	const noteQuery = supabase
		.from('notes')
		.select('id, title, body, projects(title)')
		.order('updated_at', { ascending: false })

	const [{ data: notes }, { data: projects }] = await Promise.all([
		projectId ? noteQuery.eq('project_id', projectId) : noteQuery,
		supabase.from('projects').select('id, title').neq('status', 'archived').order('title')
	])

	return {
		notes: notes ?? [],
		projects: (projects ?? []).map(({ id: projectId, title }) => ({
			value: projectId,
			label: title
		})),
		projectId
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData()
		const title = text(formData, 'title')
		const body = text(formData, 'body')
		if (!title && !body) return failMessage('Write something first.')

		const { error } = await locals.supabase
			.from('notes')
			.insert({ title, body, project_id: text(formData, 'project_id') })
		if (error) return failWith(error)
		return { success: 'Note saved.' }
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error } = await locals.supabase
			.from('notes')
			.update({ title: text(formData, 'title'), body: text(formData, 'body') })
			.eq('id', id(formData))
		if (error) return failWith(error)
		return { success: 'Saved.' }
	},

	delete: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('notes')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Deleted.' }
	}
}

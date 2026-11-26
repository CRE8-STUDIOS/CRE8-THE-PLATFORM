import { redirect } from '@sveltejs/kit'
import { text, checkbox, failMessage, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase } = locals
	const projectId = url.searchParams.get('project')
	const boardQuery = supabase
		.from('moodboards')
		.select('id, title, visible_to_client, projects(title)')
		.order('updated_at', { ascending: false })

	const [{ data: boards }, { data: projects }] = await Promise.all([
		projectId ? boardQuery.eq('project_id', projectId) : boardQuery,
		supabase.from('projects').select('id, title').neq('status', 'archived').order('title')
	])

	return {
		boards: boards ?? [],
		projects: (projects ?? []).map(({ id, title }) => ({ value: id, label: title })),
		projectId
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData()
		const title = text(formData, 'title')
		if (!title) return failMessage('Give the board a title.')

		const { data, error } = await locals.supabase
			.from('moodboards')
			.insert({
				title,
				project_id: text(formData, 'project_id'),
				visible_to_client: checkbox(formData, 'visible_to_client')
			})
			.select('id')
			.single()
		if (error) return failWith(error)

		redirect(303, `/moodboards/${data.id}`)
	}
}

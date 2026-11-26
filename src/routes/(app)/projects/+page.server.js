import { redirect } from '@sveltejs/kit'
import { failMessage, failWith } from '#lib/server/form.js'
import { projectFromForm, clientOptions } from '#lib/server/projects.js'
import { PROJECT_STATUSES } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase } = locals
	const status = url.searchParams.get('status')
	const query = supabase
		.from('projects')
		.select('id, title, status, deadline, clients(name)')
		.order('created_at', { ascending: false })
	const filtered =
		status && PROJECT_STATUSES.includes(status)
			? query.eq('status', /** @type {any} */ (status))
			: query.neq('status', 'archived')

	const [{ data: projects }, clients] = await Promise.all([filtered, clientOptions(supabase)])

	return {
		projects: projects ?? [],
		clients,
		status,
		preselectedClient: url.searchParams.get('client') ?? ''
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals }) => {
		const project = projectFromForm(await request.formData())
		if (!project.title) return failMessage('Give the project a title.')

		const { data, error } = await locals.supabase
			.from('projects')
			.insert(project)
			.select('id')
			.single()
		if (error) return failWith(error)

		redirect(303, `/projects/${data.id}`)
	}
}

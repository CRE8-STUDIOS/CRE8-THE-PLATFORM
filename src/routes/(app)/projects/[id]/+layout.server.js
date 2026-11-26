import { error } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, params }) => {
	const { data: project } = await locals.supabase
		.from('projects')
		.select('*, clients(id, name, email)')
		.eq('id', params.id)
		.maybeSingle()
	if (!project) error(404, 'Project not found')

	const base = `/projects/${project.id}`
	return {
		project,
		projectTabs: [
			{ href: base, text: 'Overview' },
			{ href: `${base}/contract`, text: 'Contract' },
			{ href: `${base}/requests`, text: 'Requests' },
			{ href: `${base}/files`, text: 'Files' },
			{ href: `${base}/updates`, text: 'Updates' },
			{ href: `/moodboards?project=${project.id}`, text: 'Moodboards' },
			{ href: `/notes?project=${project.id}`, text: 'Notes' },
			{ href: `/finance?project=${project.id}`, text: 'Facturen' },
			{ href: `/time?project=${project.id}`, text: 'Hours' },
			{ href: `${base}/portal`, text: 'Client portal' }
		]
	}
}

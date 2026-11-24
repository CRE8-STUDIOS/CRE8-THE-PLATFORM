import { redirect } from '@sveltejs/kit'
import { text, oneOf, failMessage, failWith } from '#lib/server/form.js'
import { projectFromForm, clientOptions } from '#lib/server/projects.js'
import { PROJECT_STATUSES, toOptions } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => ({
	clients: await clientOptions(locals.supabase),
	statusOptions: toOptions(PROJECT_STATUSES)
})

/** @type {import('./$types').Actions} */
export const actions = {
	update: async ({ request, locals, params }) => {
		const project = projectFromForm(await request.formData())
		if (!project.title) return failMessage('A project needs a title.')

		const { error } = await locals.supabase.from('projects').update(project).eq('id', params.id)
		if (error) return failWith(error)
		return { success: 'Saved.' }
	},

	status: async ({ request, locals, params }) => {
		const status = oneOf(text(await request.formData(), 'status'), PROJECT_STATUSES, 'draft')

		const { error } = await locals.supabase.from('projects').update({ status }).eq('id', params.id)
		if (error) return failWith(error)
		return { success: `Status is now ${status}.` }
	},

	delete: async ({ locals, params }) => {
		const { error } = await locals.supabase.from('projects').delete().eq('id', params.id)
		if (error) return failWith(error)
		redirect(303, '/projects')
	}
}

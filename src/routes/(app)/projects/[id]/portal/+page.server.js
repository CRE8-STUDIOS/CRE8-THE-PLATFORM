import { id, text, failMessage, failWith } from '#lib/server/form.js'

/**
 * Who can see this project in the client portal.
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ locals, params, url }) => {
	const { data: access } = await locals.supabase
		.from('portal_access')
		.select('id, invited_email, accepted_at, last_seen_at')
		.eq('project_id', params.id)
		.order('invited_at')

	return { access: access ?? [], signupLink: `${url.origin}/portal/signup` }
}

/** @type {import('./$types').Actions} */
export const actions = {
	invite: async ({ request, locals, params }) => {
		const { supabase } = locals
		const email = text(await request.formData(), 'email')
		if (!email) return failMessage('Fill in an email address.')

		const { data: project } = await supabase
			.from('projects')
			.select('client_id')
			.eq('id', params.id)
			.single()
		if (!project?.client_id)
			return failMessage('Link a client to this project first (Overview tab).')

		const { error } = await supabase
			.from('portal_access')
			.insert({
				project_id: params.id,
				client_id: project.client_id,
				invited_email: email.toLowerCase()
			})
		if (error) return failWith(error)
		return { success: `Invited ${email}. Send them the signup link below.` }
	},

	remove: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('portal_access')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Access removed.' }
	}
}

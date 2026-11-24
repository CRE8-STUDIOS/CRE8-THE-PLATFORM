import { error, redirect } from '@sveltejs/kit'
import { failMessage, failWith } from '#lib/server/form.js'
import { clientFromForm } from '#lib/server/clients.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { supabase } = locals
	const [{ data: client }, { data: projects }] = await Promise.all([
		supabase.from('clients').select('*').eq('id', params.id).maybeSingle(),
		supabase
			.from('projects')
			.select('id, title, status')
			.eq('client_id', params.id)
			.order('created_at', { ascending: false })
	])
	if (!client) error(404, 'Client not found')

	return {
		client,
		projectLinks: (projects ?? []).map(({ id, title, status }) => ({
			id,
			text: `${title} (${status})`,
			href: `/projects/${id}`
		}))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	update: async ({ request, locals, params }) => {
		const client = clientFromForm(await request.formData())
		if (!client.name) return failMessage('A client needs a name.')

		const { error: updateError } = await locals.supabase
			.from('clients')
			.update(client)
			.eq('id', params.id)
		if (updateError) return failWith(updateError)
		return { success: 'Saved.' }
	},

	archive: async ({ locals, params }) => {
		const { error: archiveError } = await locals.supabase
			.from('clients')
			.update({ archived_at: new Date().toISOString() })
			.eq('id', params.id)
		if (archiveError) return failWith(archiveError)
		return { success: 'Client archived.' }
	},

	unarchive: async ({ locals, params }) => {
		const { error: unarchiveError } = await locals.supabase
			.from('clients')
			.update({ archived_at: null })
			.eq('id', params.id)
		if (unarchiveError) return failWith(unarchiveError)
		return { success: 'Client is active again.' }
	},

	delete: async ({ locals, params }) => {
		const { error: deleteError } = await locals.supabase
			.from('clients')
			.delete()
			.eq('id', params.id)
		if (deleteError) return failWith(deleteError)
		redirect(303, '/clients')
	}
}

import { redirect } from '@sveltejs/kit'
import { failMessage, failWith } from '#lib/server/form.js'
import { clientFromForm } from '#lib/server/clients.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const showArchived = url.searchParams.get('archived') === '1'
	const query = locals.supabase.from('clients').select('id, name, company, email').order('name')
	const { data: clients } = await (showArchived
		? query.not('archived_at', 'is', null)
		: query.is('archived_at', null))

	return { clients: clients ?? [], showArchived }
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals }) => {
		const client = clientFromForm(await request.formData())
		if (!client.name) return failMessage('Give the client a name.')

		const { data, error } = await locals.supabase
			.from('clients')
			.insert(client)
			.select('id')
			.single()
		if (error) return failWith(error)

		redirect(303, `/clients/${data.id}`)
	}
}

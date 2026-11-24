import { id, text, number, failMessage, failWith } from '#lib/server/form.js'

/** Request fields from a create/edit form. */
const requestFromForm = (/** @type {FormData} */ formData) => ({
	title: text(formData, 'title') ?? '',
	description: text(formData, 'description'),
	price: number(formData, 'price'),
	estimated_hours: number(formData, 'estimated_hours'),
	planned_start: text(formData, 'planned_start')
})

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { data: requests } = await locals.supabase
		.from('requests')
		.select(
			'id, title, description, price, estimated_hours, planned_start, status, requested_by, approved_at, declined_at'
		)
		.eq('project_id', params.id)
		.order('created_at', { ascending: false })

	return { requests: requests ?? [] }
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals, params }) => {
		const { supabase } = locals
		const fields = requestFromForm(await request.formData())
		if (!fields.title) return failMessage('Give the request a title.')

		const { data: contract } = await supabase
			.from('contracts')
			.select('id')
			.eq('project_id', params.id)
			.maybeSingle()
		const { error } = await supabase
			.from('requests')
			.insert({ ...fields, project_id: params.id, contract_id: contract?.id ?? null })
		if (error) return failWith(error)
		return { success: 'Request added as draft.' }
	},

	/** Update price/details (a draft, or a request the client asked for). */
	update: async ({ request, locals }) => {
		const formData = await request.formData()
		const fields = requestFromForm(formData)
		if (!fields.title) return failMessage('A request needs a title.')

		const { error } = await locals.supabase.from('requests').update(fields).eq('id', id(formData))
		if (error) return failWith(error)
		return { success: 'Saved.' }
	},

	send: async ({ request, locals }) => {
		const { supabase } = locals
		const requestId = id(await request.formData())

		const { data: current } = await supabase
			.from('requests')
			.select('price')
			.eq('id', requestId)
			.single()
		if (current?.price == null) return failMessage('Add a price before sending the request.')

		const { error } = await supabase
			.from('requests')
			.update({ status: 'sent', sent_at: new Date().toISOString() })
			.eq('id', requestId)
		if (error) return failWith(error)
		return { success: 'Sent. Your client can approve and sign it in the portal.' }
	},

	delete: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('requests')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Request deleted.' }
	}
}

import { error, redirect } from '@sveltejs/kit'
import { id, text, number, oneOf, failMessage, failWith } from '#lib/server/form.js'
import { clientOptions } from '#lib/server/projects.js'
import { VAT_TREATMENTS, VAT_RATES } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { supabase } = locals
	const [{ data: invoice }, { data: lines }, clients] = await Promise.all([
		supabase.from('invoice_overview').select('*').eq('id', params.id).maybeSingle(),
		supabase
			.from('invoice_lines')
			.select('id, description, quantity, unit_price, vat_rate')
			.eq('invoice_id', params.id)
			.order('position'),
		clientOptions(supabase)
	])
	if (!invoice) error(404, 'Factuur not found')

	const [{ data: project }, { data: approvedRequests }] = await Promise.all([
		invoice.project_id
			? supabase.from('projects').select('id, title').eq('id', invoice.project_id).maybeSingle()
			: Promise.resolve({ data: null }),
		invoice.project_id
			? supabase
					.from('requests')
					.select('id, title, price')
					.eq('project_id', invoice.project_id)
					.eq('status', 'approved')
			: Promise.resolve({ data: [] })
	])

	// Approved requests that aren't on any factuur line yet
	const requestIds = (approvedRequests ?? []).map(({ id: requestId }) => requestId)
	const { data: billed } = requestIds.length
		? await supabase.from('invoice_lines').select('request_id').in('request_id', requestIds)
		: { data: [] }
	const billedIds = new Set((billed ?? []).map(({ request_id }) => request_id))

	return {
		invoice,
		lines: (lines ?? []).map((line) => ({
			...line,
			amount: Number(line.quantity) * Number(line.unit_price)
		})),
		project,
		clients,
		openRequests: (approvedRequests ?? []).filter(({ id: requestId }) => !billedIds.has(requestId))
	}
}

/** Change the status of this factuur (send, paid, unpaid). */
const setStatus = async (
	/** @type {App.Locals} */ locals,
	/** @type {string} */ invoiceId,
	/** @type {'sent' | 'paid'} */ status
) => (await locals.supabase.from('invoices').update({ status }).eq('id', invoiceId)).error

/** @type {import('./$types').Actions} */
export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const { error: updateError } = await locals.supabase
			.from('invoices')
			.update({
				client_id: text(formData, 'client_id') ?? undefined,
				issue_date: text(formData, 'issue_date'),
				due_date: text(formData, 'due_date'),
				vat_treatment: oneOf(text(formData, 'vat_treatment'), VAT_TREATMENTS, 'standard'),
				notes: text(formData, 'notes')
			})
			.eq('id', params.id)
		if (updateError) return failWith(updateError)
		return { success: 'Saved.' }
	},

	addLine: async ({ request, locals, params }) => {
		const { supabase } = locals
		const formData = await request.formData()
		const description = text(formData, 'description')
		const unitPrice = number(formData, 'unit_price')
		if (!description || unitPrice === null) return failMessage('Fill in a description and a price.')

		const { count } = await supabase
			.from('invoice_lines')
			.select('id', { count: 'exact', head: true })
			.eq('invoice_id', params.id)
		const { error: insertError } = await supabase.from('invoice_lines').insert({
			invoice_id: params.id,
			description,
			quantity: number(formData, 'quantity') ?? 1,
			unit_price: unitPrice,
			vat_rate: Number(oneOf(text(formData, 'vat_rate'), VAT_RATES.map(String), '21')),
			position: count ?? 0
		})
		if (insertError) return failWith(insertError)
	},

	addRequestLine: async ({ request, locals, params }) => {
		const { supabase } = locals
		const { data: approved } = await supabase
			.from('requests')
			.select('id, title, price')
			.eq('id', id(await request.formData(), 'request_id'))
			.single()
		if (!approved) return failMessage('Request not found.')

		const { error: insertError } = await supabase.from('invoice_lines').insert({
			invoice_id: params.id,
			request_id: approved.id,
			description: approved.title,
			quantity: 1,
			unit_price: approved.price ?? 0,
			position: 999
		})
		if (insertError) return failWith(insertError)
	},

	removeLine: async ({ request, locals }) => {
		const { error: deleteError } = await locals.supabase
			.from('invoice_lines')
			.delete()
			.eq('id', id(await request.formData()))
		if (deleteError) return failWith(deleteError)
	},

	send: async ({ locals, params }) => {
		const sendError = await setStatus(locals, params.id, 'sent')
		if (sendError) return failWith(sendError)
		return {
			success:
				'Sent! The number is set and the factuur is locked. Your client sees it in the portal.'
		}
	},

	markPaid: async ({ locals, params }) => {
		const paidError = await setStatus(locals, params.id, 'paid')
		if (paidError) return failWith(paidError)
		return { success: 'Marked as paid.' }
	},

	markUnpaid: async ({ locals, params }) => {
		const unpaidError = await setStatus(locals, params.id, 'sent')
		if (unpaidError) return failWith(unpaidError)
		return { success: 'Marked as unpaid.' }
	},

	delete: async ({ locals, params }) => {
		const { error: deleteError } = await locals.supabase
			.from('invoices')
			.delete()
			.eq('id', params.id)
		if (deleteError) return failWith(deleteError)
		redirect(303, '/finance')
	},

	/** Correct a sent factuur: a new draft with the same lines, as negative amounts. */
	createCredit: async ({ locals, params }) => {
		const { supabase } = locals
		const [{ data: original }, { data: lines }] = await Promise.all([
			supabase
				.from('invoices')
				.select('client_id, project_id, vat_treatment')
				.eq('id', params.id)
				.single(),
			supabase
				.from('invoice_lines')
				.select('description, quantity, unit_price, vat_rate, position')
				.eq('invoice_id', params.id)
		])
		if (!original) return failMessage('Factuur not found.')

		const { data: credit, error: creditError } = await supabase
			.from('invoices')
			.insert({ ...original, credits_invoice_id: params.id })
			.select('id')
			.single()
		if (creditError) return failWith(creditError)

		if (lines?.length) {
			const creditLines = lines.map((line) => ({
				...line,
				invoice_id: credit.id,
				unit_price: -Number(line.unit_price),
				description: `Credit: ${line.description}`
			}))
			const { error: linesError } = await supabase.from('invoice_lines').insert(creditLines)
			if (linesError) return failWith(linesError)
		}
		redirect(303, `/finance/invoices/${credit.id}`)
	}
}

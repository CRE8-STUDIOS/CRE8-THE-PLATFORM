import { redirect } from '@sveltejs/kit'
import { text, failMessage, failWith } from '#lib/server/form.js'
import { clientOptions } from '#lib/server/projects.js'
import { todayIn } from '#lib/utils/dates.js'
import { EU_COUNTRIES } from '#lib/utils/constants.js'

const sum = (/** @type {Record<string, unknown>[]} */ rows, /** @type {string} */ key) =>
	rows.reduce((total, row) => total + Number(row[key] ?? 0), 0)

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone } = locals
	const projectId = url.searchParams.get('project')
	const today = todayIn(timezone)
	const year = Number(today.slice(0, 4))
	const quarter = Math.floor((Number(today.slice(5, 7)) - 1) / 3)
	const quarterStart = `${year}-${String(quarter * 3 + 1).padStart(2, '0')}-01`
	const quarterEnd =
		quarter === 3 ? `${year + 1}-01-01` : `${year}-${String(quarter * 3 + 4).padStart(2, '0')}-01`

	const invoiceQuery = supabase
		.from('invoice_overview')
		.select(
			'id, invoice_number, status, total, is_overdue, days_overdue, credits_invoice_id, client_id'
		)
		.order('created_at', { ascending: false })

	const [invoices, clients, projects, quarterInvoices, quarterExpenses] = await Promise.all([
		projectId ? invoiceQuery.eq('project_id', projectId) : invoiceQuery,
		clientOptions(supabase),
		supabase.from('projects').select('id, title').neq('status', 'archived').order('title'),
		supabase
			.from('invoices')
			.select('subtotal, vat_total')
			.neq('status', 'draft')
			.gte('issue_date', quarterStart)
			.lt('issue_date', quarterEnd),
		supabase
			.from('expenses')
			.select('amount_excl_vat, vat_amount')
			.gte('date', quarterStart)
			.lt('date', quarterEnd)
	])

	const clientNames = Object.fromEntries(clients.map(({ value, label }) => [value, label]))
	const btwCharged = sum(quarterInvoices.data ?? [], 'vat_total')
	const btwPaid = sum(quarterExpenses.data ?? [], 'vat_amount')

	return {
		projectId,
		invoices: (invoices.data ?? []).map((invoice) => ({
			...invoice,
			clientName: clientNames[invoice.client_id ?? ''] ?? 'client'
		})),
		clients,
		projects: (projects.data ?? []).map(({ id, title }) => ({ value: id, label: title })),
		quarter: {
			label: `Q${quarter + 1} ${year}`,
			revenue: sum(quarterInvoices.data ?? [], 'subtotal'),
			btwCharged,
			costs: sum(quarterExpenses.data ?? [], 'amount_excl_vat'),
			btwPaid,
			btwToPay: btwCharged - btwPaid
		}
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	createInvoice: async ({ request, locals }) => {
		const { supabase } = locals
		const formData = await request.formData()
		const projectId = text(formData, 'project_id')

		const { data: project } = projectId
			? await supabase.from('projects').select('client_id').eq('id', projectId).single()
			: { data: null }
		const clientId = text(formData, 'client_id') ?? project?.client_id
		if (!clientId) return failMessage('Choose a client (or a project that has one).')

		const { data: client } = await supabase
			.from('clients')
			.select('country, btw_number')
			.eq('id', clientId)
			.single()
		const country = (client?.country ?? 'NL').toUpperCase()
		const vat_treatment =
			country === 'NL'
				? 'standard'
				: EU_COUNTRIES.includes(country)
					? client?.btw_number
						? 'reverse_charge'
						: 'standard'
					: 'outside_eu'

		const { data, error } = await supabase
			.from('invoices')
			.insert({ client_id: clientId, project_id: projectId, vat_treatment })
			.select('id')
			.single()
		if (error) return failWith(error)

		redirect(303, `/finance/invoices/${data.id}`)
	}
}

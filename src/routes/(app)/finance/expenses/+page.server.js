import {
	id,
	text,
	number,
	file,
	oneOf,
	failMessage,
	failWith,
	storagePath,
	signedUrls
} from '#lib/server/form.js'
import { VAT_RATES } from '#lib/utils/constants.js'

const BUCKET = 'receipts'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase } = locals
	const [{ data }, { data: projects }] = await Promise.all([
		supabase
			.from('expenses')
			.select(
				'id, date, supplier, amount_excl_vat, vat_amount, category, receipt_path, projects(title)'
			)
			.order('date', { ascending: false })
			.limit(200),
		supabase.from('projects').select('id, title').neq('status', 'archived').order('title')
	])

	const expenses = data ?? []
	const urls = await signedUrls(
		supabase,
		BUCKET,
		expenses.map(({ receipt_path }) => receipt_path)
	)

	return {
		expenses: expenses.map(({ receipt_path, ...expense }) => ({
			...expense,
			receiptUrl: receipt_path ? (urls[receipt_path] ?? null) : null
		})),
		projects: (projects ?? []).map(({ id: projectId, title }) => ({
			value: projectId,
			label: title
		}))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals }) => {
		const { supabase, user } = locals
		const formData = await request.formData()
		const amount = number(formData, 'amount_excl_vat')
		if (amount === null) return failMessage('Fill in the amount excl. btw.')

		const rateText = text(formData, 'vat_rate')
		const vatRate = rateText === null ? null : Number(oneOf(rateText, VAT_RATES.map(String), '21'))
		const vatAmount =
			number(formData, 'vat_amount') ?? (vatRate === null ? 0 : Math.round(amount * vatRate) / 100)

		const receipt = file(formData, 'receipt')
		const receiptPath = receipt ? storagePath(user?.id ?? '', ['receipts'], receipt.name) : null
		if (receipt && receiptPath) {
			const { error: uploadError } = await supabase.storage
				.from(BUCKET)
				.upload(receiptPath, receipt, { contentType: receipt.type })
			if (uploadError) return failWith(uploadError)
		}

		const { error } = await supabase.from('expenses').insert({
			supplier: text(formData, 'supplier'),
			date: text(formData, 'date') ?? undefined,
			amount_excl_vat: amount,
			vat_amount: vatAmount,
			vat_rate: vatRate,
			category: text(formData, 'category'),
			project_id: text(formData, 'project_id'),
			note: text(formData, 'note'),
			receipt_path: receiptPath
		})
		if (error) return failWith(error)
		return { success: 'Expense added.' }
	},

	delete: async ({ request, locals }) => {
		const { supabase } = locals
		const expenseId = id(await request.formData())
		const { data: row } = await supabase
			.from('expenses')
			.select('receipt_path')
			.eq('id', expenseId)
			.single()

		const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
		if (error) return failWith(error)
		if (row?.receipt_path) await supabase.storage.from(BUCKET).remove([row.receipt_path])
		return { success: 'Deleted.' }
	}
}

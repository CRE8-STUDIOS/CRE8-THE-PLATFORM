import { text, number, checkbox, oneOf, failWith } from '#lib/server/form.js'
import { BUSINESS_TYPES } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { data: business } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', locals.user?.id ?? '')
		.single()
	return { business }
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, locals }) => {
		const formData = await request.formData()
		const reminderDays = (text(formData, 'reminder_days') ?? '')
			.split(',')
			.map((value) => Number(value.trim()))
			.filter((days) => Number.isInteger(days) && days > 0)

		const { error } = await locals.supabase
			.from('profiles')
			.update({
				name: text(formData, 'name'),
				business_name: text(formData, 'business_name'),
				kvk_number: text(formData, 'kvk_number'),
				btw_number: text(formData, 'btw_number'),
				iban: text(formData, 'iban'),
				street: text(formData, 'street'),
				postal_code: text(formData, 'postal_code'),
				city: text(formData, 'city'),
				country: (text(formData, 'country') ?? 'NL').toUpperCase(),
				business_type: oneOf(text(formData, 'business_type'), BUSINESS_TYPES, 'eenmanszaak'),
				uses_kor: checkbox(formData, 'uses_kor'),
				is_starter: checkbox(formData, 'is_starter'),
				default_hourly_rate: number(formData, 'default_hourly_rate'),
				invoice_prefix: text(formData, 'invoice_prefix'),
				payment_term_days: number(formData, 'payment_term_days') ?? 30,
				reminder_days: reminderDays.length ? reminderDays : [3, 14, 30]
			})
			.eq('id', locals.user?.id ?? '')
		if (error) return failWith(error)
		return { success: 'Saved.' }
	}
}

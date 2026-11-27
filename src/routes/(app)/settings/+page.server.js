import { text, number, checkbox, oneOf, failWith, failMessage } from '#lib/server/form.js'
import {
	ASSISTANT_COLORS,
	ASSISTANT_NAME_MAX,
	ASSISTANT_SHAPES,
	BUSINESS_TYPES
} from '#lib/utils/constants.js'

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
	},

	assistant: async ({ request, locals }) => {
		const formData = await request.formData()
		const name = text(formData, 'assistant_name')
		const color = ASSISTANT_COLORS.find((value) => value === formData.get('assistant_color'))
		const shape = ASSISTANT_SHAPES.find((value) => value === formData.get('assistant_shape'))

		if (name && [...name].length > ASSISTANT_NAME_MAX)
			return failMessage(`The name can be ${ASSISTANT_NAME_MAX} characters at most.`)
		if (!color) return failMessage('Choose one of the colours.')
		if (!shape) return failMessage('Choose one of the shapes.')

		const { error } = await locals.supabase
			.from('profiles')
			.update({
				assistant_name: name,
				assistant_color: color,
				assistant_shape: shape,
				workspace_matches_assistant: checkbox(formData, 'workspace_matches_assistant')
			})
			.eq('id', locals.user?.id ?? '')
		if (error) return failWith(error)
		return { success: 'Assistant saved.' }
	}
}

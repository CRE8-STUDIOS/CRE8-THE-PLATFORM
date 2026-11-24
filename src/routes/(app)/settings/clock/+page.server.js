import { text, number, oneOf, failMessage, failWith } from '#lib/server/form.js'
import { CLOCK_IN_MODES } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { data: settings } = await locals.supabase
		.from('profiles')
		.select(
			'clock_in_mode, check_in_after_minutes, timezone, meeting_minutes, booking_notice_hours, booking_days_ahead'
		)
		.eq('id', locals.user?.id ?? '')
		.single()
	return { settings }
}

/** Is this a time zone the browser and server know? */
const isTimeZone = (/** @type {string} */ timeZone) => {
	try {
		new Intl.DateTimeFormat('en', { timeZone })
		return true
	} catch {
		return false
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, locals }) => {
		const formData = await request.formData()
		const timezone = text(formData, 'timezone') ?? 'Europe/Amsterdam'
		if (!isTimeZone(timezone)) return failMessage(`Unknown time zone: ${timezone}`)

		const { error } = await locals.supabase
			.from('profiles')
			.update({
				clock_in_mode: oneOf(text(formData, 'clock_in_mode'), CLOCK_IN_MODES, 'ask'),
				check_in_after_minutes: number(formData, 'check_in_after_minutes') ?? 120,
				timezone,
				meeting_minutes: number(formData, 'meeting_minutes') ?? 30,
				booking_notice_hours: number(formData, 'booking_notice_hours') ?? 24,
				booking_days_ahead: number(formData, 'booking_days_ahead') ?? 30
			})
			.eq('id', locals.user?.id ?? '')
		if (error) return failWith(error)
		return { success: 'Saved.' }
	}
}

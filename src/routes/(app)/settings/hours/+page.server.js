import { id, text, oneOf, failMessage, failWith } from '#lib/server/form.js'
import { WEEKDAYS, WORKING_HOURS_KINDS } from '#lib/utils/constants.js'

const KIND_TITLES = {
	work: 'Working hours',
	creative: 'Best creative hours',
	meetings: 'Open for client meetings'
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { data } = await locals.supabase
		.from('working_hours')
		.select('id, weekday, starts_at, ends_at, kind')
		.order('weekday')
		.order('starts_at')
	const hours = data ?? []

	// One group per kind, with readable rows
	return {
		groups: WORKING_HOURS_KINDS.map((kind) => ({
			kind,
			title: KIND_TITLES[/** @type {keyof typeof KIND_TITLES} */ (kind)],
			rows: hours
				.filter((row) => row.kind === kind)
				.map(({ id: rowId, weekday, starts_at, ends_at }) => ({
					id: rowId,
					text: `${WEEKDAYS[weekday - 1]} ${starts_at.slice(0, 5)} to ${ends_at.slice(0, 5)}`
				}))
		})),
		kinds: WORKING_HOURS_KINDS.map((kind) => ({
			value: kind,
			label: KIND_TITLES[/** @type {keyof typeof KIND_TITLES} */ (kind)]
		}))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals }) => {
		const formData = await request.formData()
		const weekdays = formData
			.getAll('weekday')
			.map(Number)
			.filter((day) => day >= 1 && day <= 7)
		const startsAt = text(formData, 'starts_at')
		const endsAt = text(formData, 'ends_at')
		if (!weekdays.length || !startsAt || !endsAt) return failMessage('Pick days and times.')

		const kind = oneOf(text(formData, 'kind'), WORKING_HOURS_KINDS, 'work')
		const { error } = await locals.supabase
			.from('working_hours')
			.insert(weekdays.map((weekday) => ({ weekday, starts_at: startsAt, ends_at: endsAt, kind })))
		if (error) return failWith(error)
		return { success: 'Added.' }
	},

	delete: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('working_hours')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Removed.' }
	}
}

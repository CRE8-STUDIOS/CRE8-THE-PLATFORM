import { text, number, checkbox, oneOf } from '#lib/server/form.js'
import { toUtcIso } from '#lib/utils/dates.js'
import { AGENDA_TYPES, ENERGY_TYPES } from '#lib/utils/constants.js'

/**
 * Agenda item fields from the create or edit form. Times are read in the freelancer's time zone.
 * Fields that aren't in the form are left out, so the short "add" form doesn't wipe anything.
 */
export const agendaItemFromForm = (
	/** @type {FormData} */ formData,
	/** @type {string} */ timeZone
) => {
	const allDay = checkbox(formData, 'all_day')
	const type = oneOf(text(formData, 'type'), AGENDA_TYPES, 'task')
	const startsAt = text(formData, 'starts_at')

	/** @type {Record<string, unknown>} */
	const item = {
		type,
		title: text(formData, 'title') ?? '',
		description: text(formData, 'description'),
		project_id: text(formData, 'project_id'),
		starts_at: toUtcIso(allDay ? (startsAt?.slice(0, 10) ?? null) : startsAt, timeZone),
		ends_at: allDay ? null : toUtcIso(text(formData, 'ends_at'), timeZone),
		all_day: allDay,
		due_date: text(formData, 'due_date'),
		estimated_minutes: number(formData, 'estimated_minutes'),
		location_name: text(formData, 'location_name'),
		is_protected: type === 'rest' && checkbox(formData, 'is_protected')
	}

	// Extra fields only in the full edit form
	if (formData.has('energy')) {
		const reminders = (text(formData, 'reminder_minutes') ?? '')
			.split(',')
			.map((value) => Number(value.trim()))
			.filter((minutes) => Number.isInteger(minutes) && minutes >= 0)

		Object.assign(item, {
			energy: text(formData, 'energy')
				? oneOf(text(formData, 'energy'), ENERGY_TYPES, 'other')
				: null,
			address: text(formData, 'address'),
			meeting_url: text(formData, 'meeting_url'),
			opens_at: text(formData, 'opens_at'),
			closes_at: text(formData, 'closes_at'),
			call_time: toUtcIso(text(formData, 'call_time'), timeZone),
			travel_before_minutes: number(formData, 'travel_before_minutes') ?? 0,
			travel_after_minutes: number(formData, 'travel_after_minutes') ?? 0,
			recurrence_rule: text(formData, 'recurrence_rule'),
			recurrence_until: text(formData, 'recurrence_until'),
			reminder_minutes: reminders,
			color: text(formData, 'color')
		})
	}

	return item
}

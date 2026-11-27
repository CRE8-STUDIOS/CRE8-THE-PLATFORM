import { text, number, checkbox, oneOf } from '#lib/server/form.js'
import { toUtcIso } from '#lib/utils/dates.js'
import { expandItem } from '#lib/agenda/recurrence.js'
import { AGENDA_TYPES, ENERGY_TYPES } from '#lib/utils/constants.js'

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

const ITEM_COLUMNS =
	'id, type, title, starts_at, ends_at, all_day, due_date, status, is_protected, energy, location_name, closes_at, travel_before_minutes, travel_after_minutes, recurrence_rule, recurrence_until, projects(title)'

/**
 * Agenda items between two local dates, repeating items expanded, sorted by start.
 * Items without a time (deadlines with only a date) are included by their due date.
 * @param {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} supabase
 * @param {string} from first local date, YYYY-MM-DD
 * @param {string} to local date after the range
 * @param {string} timeZone
 */
export const loadAgendaRange = async (supabase, from, to, timeZone) => {
	const fromIso = /** @type {string} */ (toUtcIso(from, timeZone))
	const toIso = /** @type {string} */ (toUtcIso(to, timeZone))

	const [single, repeating, dated] = await Promise.all([
		supabase
			.from('agenda_items')
			.select(ITEM_COLUMNS)
			.is('recurrence_rule', null)
			.gte('starts_at', fromIso)
			.lt('starts_at', toIso),
		supabase
			.from('agenda_items')
			.select(ITEM_COLUMNS)
			.not('recurrence_rule', 'is', null)
			.lt('starts_at', toIso)
			.or(`recurrence_until.is.null,recurrence_until.gte.${from}`),
		supabase
			.from('agenda_items')
			.select(ITEM_COLUMNS)
			.is('starts_at', null)
			.eq('type', 'deadline')
			.gte('due_date', from)
			.lt('due_date', to)
	])

	const error = single.error ?? repeating.error ?? dated.error
	if (error) throw error

	const timed = [...(single.data ?? []), ...(repeating.data ?? [])].flatMap((item) =>
		expandItem(item, from, to, timeZone)
	)
	timed.sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))

	return [...(dated.data ?? []).map((item) => ({ ...item, occurrence: null })), ...timed]
}

/**
 * Project deadlines between two local dates, shaped like agenda deadlines.
 * @param {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} supabase
 * @param {string} from
 * @param {string} to
 */
export const loadProjectDeadlines = async (supabase, from, to) => {
	const { data, error } = await supabase
		.from('projects')
		.select('id, title, deadline')
		.gte('deadline', from)
		.lt('deadline', to)
	if (error) throw error
	return (data ?? []).map((project) => ({
		id: project.id,
		href: `/projects/${project.id}`,
		type: 'deadline',
		title: `Deadline ${project.title}`,
		starts_at: null,
		ends_at: null,
		due_date: project.deadline,
		occurrence: null
	}))
}

/**
 * The user's planned hours per week, from profiles.week_target_hours.
 * @param {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} supabase
 * @param {string} userId
 */
export const weekTargetHours = async (supabase, userId) => {
	const { data } = await supabase
		.from('profiles')
		.select('week_target_hours')
		.eq('id', userId)
		.maybeSingle()
	return data?.week_target_hours ?? 30
}

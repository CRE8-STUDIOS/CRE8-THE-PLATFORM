import { toUtcIso } from '#lib/utils/dates.js'
import { expandItem } from '#lib/agenda/recurrence.js'

const ITEM_COLUMNS = '*, projects(title)'

/**
 * Agenda items between two local dates, repeating items expanded, sorted by start.
 * Items without a time (deadlines and tasks with only a date) are included by their due date.
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
			.in('type', ['deadline', 'task'])
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
 * Deadlines of projects that are not archived, between two local dates, shaped like agenda deadlines.
 * @param {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} supabase
 * @param {string} from
 * @param {string} to
 */
export const loadProjectDeadlines = async (supabase, from, to) => {
	const { data, error } = await supabase
		.from('projects')
		.select('id, title, deadline')
		.neq('status', 'archived')
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

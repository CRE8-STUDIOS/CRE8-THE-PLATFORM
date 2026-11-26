import { dayRange } from '#lib/utils/dates.js'

/** @typedef {App.Locals['supabase']} Supabase */

/** @param {Supabase} supabase @param {string} today @param {{ start: string, end: string }} range */
export const countTodayTasks = async (supabase, today, { start, end }) => {
	const { count } = await supabase
		.from('agenda_items')
		.select('id', { count: 'exact', head: true })
		.eq('type', 'task')
		.eq('status', 'open')
		.or(`due_date.eq.${today},and(starts_at.gte."${start}",starts_at.lt."${end}")`)

	return count ?? 0
}

/** @param {Supabase} supabase @param {'meeting' | 'errand'} type @param {{ start: string, end: string }} range */
const itemsStartingToday = (supabase, type, { start, end }) =>
	supabase
		.from('agenda_items')
		.select('title, starts_at, all_day, projects(clients(name, company))')
		.eq('type', type)
		.gte('starts_at', start)
		.lt('starts_at', end)
		.order('starts_at')

/** @param {Supabase} supabase @param {string} today @param {string} timeZone @returns {Promise<import('#lib/utils/planning.js').PlanningData>} */
export const loadPlanningData = async (supabase, today, timeZone) => {
	const range = dayRange(today, timeZone)
	const { start, end } = range

	const [meetings, errands, projects, projectDeadlines, agendaDeadlines, taskCount] =
		await Promise.all([
			itemsStartingToday(supabase, 'meeting', range),
			itemsStartingToday(supabase, 'errand', range),
			supabase.from('projects').select('title').eq('status', 'active').order('deadline'),
			supabase.from('projects').select('title').eq('deadline', today),
			supabase
				.from('agenda_items')
				.select('title')
				.eq('type', 'deadline')
				.or(`due_date.eq.${today},and(starts_at.gte."${start}",starts_at.lt."${end}")`),
			countTodayTasks(supabase, today, range)
		])

	/** @param {{ title: string, starts_at: string | null, all_day: boolean, projects: { clients: { name: string, company: string | null } | null } | null }} item */
	const withClient = ({ title, starts_at, all_day, projects }) => ({
		title,
		starts_at,
		all_day,
		client: projects?.clients?.company || projects?.clients?.name || null
	})

	return {
		meetings: (meetings.data ?? []).map(withClient),
		errands: (errands.data ?? []).map(withClient),
		projects: (projects.data ?? []).map(({ title }) => title),
		deadlines: [...(projectDeadlines.data ?? []), ...(agendaDeadlines.data ?? [])].map(
			({ title }) => title
		),
		taskCount
	}
}

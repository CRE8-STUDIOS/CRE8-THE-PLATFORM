import { id, text, oneOf, failMessage, failWith } from '#lib/server/form.js'
import { projectOptions } from '#lib/server/projects.js'
import {
	todayIn,
	mondayOf,
	addDays,
	toUtcIso,
	dateParam,
	totalHours,
	hoursBetween
} from '#lib/utils/dates.js'
import { TIME_CATEGORIES } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone } = locals
	const projectId = url.searchParams.get('project')
	const today = todayIn(timezone)
	const monday = mondayOf(dateParam(url.searchParams.get('week'), today))
	const year = Number(today.slice(0, 4))

	const weekQuery = supabase
		.from('time_entries')
		.select('id, started_at, ended_at, category, note, stopped_by, projects(title)')
		.gte('started_at', toUtcIso(monday, timezone) ?? '')
		.lt('started_at', toUtcIso(addDays(monday, 7), timezone) ?? '')
		.order('started_at', { ascending: false })

	// Project page: all hours on that project. Otherwise: all hours this year (1,225-hour criterion).
	const totalQuery = projectId
		? supabase.from('time_entries').select('started_at, ended_at').eq('project_id', projectId)
		: supabase
				.from('time_entries')
				.select('started_at, ended_at')
				.gte('started_at', toUtcIso(`${year}-01-01`, timezone) ?? '')

	const [week, total, criterion, projects, project] = await Promise.all([
		projectId ? weekQuery.eq('project_id', projectId) : weekQuery,
		totalQuery,
		supabase
			.from('tax_rules')
			.select('value')
			.eq('year', year)
			.eq('key', 'hours_criterion')
			.maybeSingle(),
		projectOptions(supabase),
		projectId
			? supabase.from('projects').select('id, title').eq('id', projectId).maybeSingle()
			: Promise.resolve({ data: null })
	])

	const entries = week.data ?? []
	const hours = totalHours(total.data ?? [])
	const hoursCriterion = Number(criterion.data?.value ?? 1225)

	return {
		monday,
		previousWeek: addDays(monday, -7),
		nextWeek: addDays(monday, 7),
		year,
		project: project.data,
		entries: entries.map((entry) => ({
			...entry,
			hours: hoursBetween(entry.started_at, entry.ended_at)
		})),
		weekHours: totalHours(entries),
		totalHours: hours,
		hoursCriterion,
		criterionPercentage: Math.min(100, Math.round((hours / hoursCriterion) * 100)),
		projects
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	/** Add hours afterwards (forgot to clock in). */
	add: async ({ request, locals }) => {
		const formData = await request.formData()
		const startedAt = toUtcIso(text(formData, 'started_at'), locals.timezone)
		const endedAt = toUtcIso(text(formData, 'ended_at'), locals.timezone)
		if (!startedAt || !endedAt) return failMessage('Fill in start and end.')

		const { error } = await locals.supabase.from('time_entries').insert({
			project_id: text(formData, 'project_id'),
			category: oneOf(text(formData, 'category'), TIME_CATEGORIES, 'client_work'),
			started_at: startedAt,
			ended_at: endedAt,
			last_active_at: endedAt,
			stopped_by: 'manual',
			note: text(formData, 'note')
		})
		if (error) return failWith(error)
		return { success: 'Hours added.' }
	},

	delete: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('time_entries')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Deleted.' }
	}
}

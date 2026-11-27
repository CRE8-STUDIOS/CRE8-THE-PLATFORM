import { buildTimeline, plannedHours } from '#lib/agenda/timeline.js'
import { dateOf } from '#lib/agenda/grid.js'
import { dayTitle, hoursText } from '#lib/agenda/labels.js'
import { loadAgendaRange, weekTargetHours } from '#lib/server/agenda.js'
import { addDays, dateParam, mondayOf, todayIn } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone, user } = locals
	const date = dateParam(url.searchParams.get('date'), todayIn(timezone))
	const monday = mondayOf(date)

	const [week, target] = await Promise.all([
		loadAgendaRange(supabase, monday, addDays(monday, 7), timezone),
		weekTargetHours(supabase, user?.id ?? '')
	])
	const day = week.filter((item) => dateOf(item, timezone) === date)

	return {
		date,
		title: dayTitle(date),
		meta: `${hoursText(plannedHours(week))} of ${target} hours this week`,
		rows: buildTimeline(day),
		allDay: day.filter((item) => item.all_day || !item.starts_at),
		previous: addDays(date, -1),
		next: addDays(date, 1)
	}
}

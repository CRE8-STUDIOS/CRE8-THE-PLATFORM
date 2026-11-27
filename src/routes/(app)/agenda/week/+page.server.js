import { weekLayout } from '#lib/agenda/grid.js'
import { plannedHours } from '#lib/agenda/timeline.js'
import { hoursText, weekTitle } from '#lib/agenda/labels.js'
import { loadAgendaRange, loadProjectDeadlines, weekTargetHours } from '#lib/server/agenda.js'
import { addDays, dateParam, mondayOf, todayIn } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone, user } = locals
	const today = todayIn(timezone)
	const date = dateParam(url.searchParams.get('date'), today)
	const monday = mondayOf(date)
	const sunday = addDays(monday, 7)

	const [items, deadlines, target] = await Promise.all([
		loadAgendaRange(supabase, monday, sunday, timezone),
		loadProjectDeadlines(supabase, monday, sunday),
		weekTargetHours(supabase, user?.id ?? '')
	])

	return {
		date,
		today,
		title: weekTitle(monday),
		meta: `${hoursText(plannedHours(items))} of ${target} hours planned`,
		layout: weekLayout([...deadlines, ...items], monday, timezone),
		previous: addDays(monday, -7),
		next: sunday
	}
}

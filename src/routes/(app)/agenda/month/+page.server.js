import { monthCells } from '#lib/agenda/grid.js'
import { monthParam, monthTitle, shiftMonth } from '#lib/agenda/labels.js'
import { loadAgendaRange, loadProjectDeadlines } from '#lib/server/agenda.js'
import { addDays, todayIn } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone } = locals
	const today = todayIn(timezone)
	const month = monthParam(url.searchParams.get('month'), today.slice(0, 7))
	const cells = monthCells(month, [], today, timezone)
	const from = cells[0].date
	const to = addDays(cells[cells.length - 1].date, 1)

	const [items, deadlines] = await Promise.all([
		loadAgendaRange(supabase, from, to, timezone),
		loadProjectDeadlines(supabase, from, to)
	])
	const all = [...deadlines, ...items]
	const deadlineCount = all.filter(
		(item) =>
			item.type === 'deadline' && (item.due_date ?? item.starts_at ?? '').slice(0, 7) === month
	).length

	return {
		month,
		title: monthTitle(month, today),
		meta: `${deadlineCount} ${deadlineCount === 1 ? 'deadline' : 'deadlines'} this month`,
		cells: monthCells(month, all, today, timezone),
		day: month === today.slice(0, 7) ? today : `${month}-01`,
		previous: shiftMonth(month, -1),
		next: shiftMonth(month, 1)
	}
}

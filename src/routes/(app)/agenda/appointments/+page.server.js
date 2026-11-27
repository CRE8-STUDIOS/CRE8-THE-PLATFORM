import { deadlineText, whenText } from '#lib/agenda/lists.js'
import { dateOf } from '#lib/agenda/grid.js'
import { itemHref } from '#lib/agenda/timeline.js'
import { loadAgendaRange, loadProjectDeadlines } from '#lib/server/agenda.js'
import { addDays, todayIn } from '#lib/utils/dates.js'

/** How far ahead appointments and deadlines are listed */
const AHEAD_DAYS = 90
const DEADLINE_DAYS = 365

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase, timezone } = locals
	const today = todayIn(timezone)

	const [items, projectDeadlines, untimed] = await Promise.all([
		loadAgendaRange(supabase, today, addDays(today, DEADLINE_DAYS), timezone),
		loadProjectDeadlines(supabase, today, addDays(today, DEADLINE_DAYS)),
		supabase
			.from('agenda_items')
			.select('id, title')
			.eq('type', 'errand')
			.is('starts_at', null)
			.eq('status', 'open')
			.order('created_at')
	])

	const soon = addDays(today, AHEAD_DAYS)
	const timedRows = (/** @type {string} */ type) =>
		items
			.filter((item) => item.type === type && item.starts_at && item.status !== 'done')
			.filter((item) => (dateOf(item, timezone) ?? '') < soon)
			.map((item) => ({
				key: `${item.id}${item.starts_at}`,
				when: whenText(
					/** @type {string} */ (dateOf(item, timezone)),
					item.all_day ? null : item.starts_at,
					today,
					timezone
				),
				title: item.title,
				href: itemHref(item)
			}))

	const deadlines = [
		...items.filter((item) => item.type === 'deadline' && item.status !== 'done'),
		...projectDeadlines
	]
		.map((item) => ({ item, day: /** @type {string} */ (dateOf(item, timezone)) }))
		.filter(({ day }) => day)
		.sort((a, b) => a.day.localeCompare(b.day))
		.map(({ item, day }) => ({
			key: `${item.id}${day}`,
			when: deadlineText(day, today),
			title: item.title,
			href: itemHref(item)
		}))

	return {
		meetings: timedRows('meeting'),
		errands: [
			...timedRows('errand'),
			...(untimed.data ?? []).map((errand) => ({
				key: errand.id,
				when: 'No time yet',
				title: errand.title,
				href: `/agenda/${errand.id}`
			}))
		],
		deadlines
	}
}

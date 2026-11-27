import { addDays, formatTime } from '#lib/utils/dates.js'

/** Order of task priorities, must first; tasks without one come after could */
const PRIORITY_ORDER = /** @type {Record<string, number>} */ ({
	must: 0,
	should: 1,
	could: 2,
	wont: 4
})

/**
 * @typedef {{ id: string, title: string, due_date: string | null, status: string, priority: string | null, estimated_minutes: number | null }} Task
 */

/** Must, should, could, won't; then by title */
export const sortTasks = (/** @type {Task[]} */ tasks) =>
	[...tasks].sort(
		(a, b) =>
			(PRIORITY_ORDER[a.priority ?? ''] ?? 3) - (PRIORITY_ORDER[b.priority ?? ''] ?? 3) ||
			a.title.localeCompare(b.title)
	)

/** Open and done tasks of one day */
export const splitDay = (/** @type {Task[]} */ tasks, /** @type {string} */ day) => {
	const onDay = sortTasks(tasks.filter((task) => task.due_date === day))
	return {
		open: onDay.filter((task) => task.status !== 'done'),
		done: onDay.filter((task) => task.status === 'done')
	}
}

/**
 * The tasks page: today, tomorrow and the seven days after that.
 * @param {Task[]} tasks
 * @param {string} today
 */
export const taskColumns = (tasks, today) => {
	const tomorrow = addDays(today, 1)
	const week = Array.from({ length: 7 }, (_, index) => addDays(today, index + 2))
	return {
		today: { date: today, ...splitDay(tasks, today) },
		tomorrow: { date: tomorrow, ...splitDay(tasks, tomorrow) },
		week: week.map((date) => ({ date, ...splitDay(tasks, date) })),
		undated: sortTasks(tasks.filter((task) => !task.due_date && task.status !== 'done'))
	}
}

/** "15 min", "1 h" or "1 h 30" */
export const minutesText = (/** @type {number | null} */ minutes) => {
	if (!minutes) return ''
	const hours = Math.floor(minutes / 60)
	const rest = minutes % 60
	if (!hours) return `${rest} min`
	return rest ? `${hours} h ${String(rest).padStart(2, '0')}` : `${hours} h`
}

const format = (/** @type {string} */ ymd, /** @type {Intl.DateTimeFormatOptions} */ options) =>
	new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(
		new Date(`${ymd}T12:00:00Z`)
	)

/** "Today 12:00", "Tomorrow 09:00" or "Mon 30 Nov 14:00"; without a time only the day */
export const whenText = (
	/** @type {string} */ day,
	/** @type {string | null} */ iso,
	/** @type {string} */ today,
	/** @type {string} */ timeZone
) => {
	const label =
		day === today
			? 'Today'
			: day === addDays(today, 1)
				? 'Tomorrow'
				: format(day, { weekday: 'short', day: 'numeric', month: 'short' })
	return iso ? `${label} ${formatTime(iso, timeZone)}` : label
}

/** "Today", "In 2 days", or the date when it is more than two weeks away */
export const deadlineText = (/** @type {string} */ day, /** @type {string} */ today) => {
	const days = Math.round(
		(new Date(`${day}T12:00:00Z`).getTime() - new Date(`${today}T12:00:00Z`).getTime()) / 86_400_000
	)
	if (days === 0) return 'Today'
	if (days === 1) return 'Tomorrow'
	if (days <= 14) return `In ${days} days`
	return format(day, { day: 'numeric', month: 'short' })
}

/** The status line of a board card */
export const cardStatus = (
	/** @type {{ board_status: string | null, client_review_status: string | null, due_date: string | null }} */ card,
	/** @type {string | null} */ client
) => {
	if (card.board_status === 'in_review') {
		if (card.client_review_status === 'changes_requested') return 'Changes requested'
		return `Waiting for ${client ?? 'the client'}`
	}
	if (card.board_status === 'done')
		return card.client_review_status === 'approved' ? 'Approved' : 'Done'
	return card.due_date ? `Due ${format(card.due_date, { day: 'numeric', month: 'short' })}` : ''
}

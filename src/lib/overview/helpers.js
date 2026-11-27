import { formatTime } from '#lib/utils/dates.js'
import { amount } from '#lib/agenda/fit.js'

/**
 * @typedef {import('#lib/agenda/timeline.js').AgendaItem} AgendaItem
 * @typedef {{ id: string, title: string, board_status: string | null, due_date: string | null }} Card
 */

const MINUTE = 60_000

/** How far ahead the deadlines card looks */
export const DEADLINE_DAYS = 14

/** Items with a start and end time, not tasks or deadlines */
const timed = (/** @type {AgendaItem[]} */ items) =>
	items
		.filter((item) => item.starts_at && item.ends_at && !item.all_day && item.type !== 'task')
		.sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))

/**
 * What RIGHT NOW is about: the work block or meeting happening now, else
 * the project someone is clocked in on, else the next item today.
 * @param {AgendaItem[]} items
 * @param {string} now
 * @param {{ project_id: string | null } | null} clock
 * @returns {{ kind: 'now' | 'next', item: AgendaItem } | { kind: 'clock', projectId: string } | null}
 */
export const currentItem = (items, now, clock) => {
	const list = timed(items)
	const happening = list.find(
		(item) =>
			(item.type === 'work' || item.type === 'meeting') &&
			String(item.starts_at) <= now &&
			now < String(item.ends_at)
	)
	if (happening) return { kind: 'now', item: happening }
	if (clock?.project_id) return { kind: 'clock', projectId: clock.project_id }
	const next = list.find((item) => String(item.starts_at) > now)
	return next ? { kind: 'next', item: next } : null
}

/** When to leave for an item with travel before it, as an ISO time */
export const leaveTime = (/** @type {AgendaItem} */ item) =>
	item.starts_at && item.travel_before_minutes
		? new Date(
				new Date(item.starts_at).getTime() - item.travel_before_minutes * MINUTE
			).toISOString()
		: null

/**
 * Minutes free after an item (travel back included) until the next timed
 * item leaves. Null when nothing comes after it today.
 * @param {AgendaItem} item
 * @param {AgendaItem[]} items
 */
export const freeAfter = (item, items) => {
	if (!item.ends_at) return null
	const back = new Date(item.ends_at).getTime() + (item.travel_after_minutes ?? 0) * MINUTE
	const following = timed(items).find(
		(other) => other !== item && new Date(String(other.starts_at)).getTime() >= back
	)
	if (!following) return null
	const leave = leaveTime(following) ?? String(following.starts_at)
	return Math.max(0, Math.round((new Date(leave).getTime() - back) / MINUTE))
}

/**
 * The suggestions for UP NEXT: every timed item still to start today, as a
 * title and one or two plain sentences.
 * @param {AgendaItem[]} items
 * @param {string} now
 * @param {string} timeZone
 */
export const upNext = (items, now, timeZone) =>
	timed(items)
		.filter((item) => String(item.starts_at) > now)
		.map((item) => {
			const leave = leaveTime(item)
			const free = freeAfter(item, items)
			const sentences = []
			if (leave)
				sentences.push(
					`Leave at ${formatTime(leave, timeZone)}, it is ${amount(Number(item.travel_before_minutes))} to get there.`
				)
			if (item.meeting_url) sentences.push('It is online, the link is in your agenda.')
			if (free !== null && free >= 15) sentences.push(`After that you have ${amount(free)} free.`)
			if (free === null) sentences.push('After that your day is free.')
			return {
				id: item.id,
				href: `/agenda/${item.id}`,
				title: `${item.title} at ${formatTime(String(item.starts_at), timeZone)}`,
				text: sentences.join(' ')
			}
		})

/** IN REVIEW, else IN PROGRESS, else TO DO, from the board cards */
export const projectStage = (/** @type {Card[]} */ cards) =>
	cards.some((card) => card.board_status === 'in_review')
		? 'In review'
		: cards.some((card) => card.board_status === 'in_progress')
			? 'In progress'
			: 'To do'

/** The first open card: in progress before to do, then by due date */
export const nextStep = (/** @type {Card[]} */ cards) => {
	const order = /** @type {Record<string, number>} */ ({ in_progress: 0, todo: 1 })
	return (
		cards
			.filter((card) => card.board_status === 'in_progress' || card.board_status === 'todo')
			.sort(
				(a, b) =>
					order[String(a.board_status)] - order[String(b.board_status)] ||
					String(a.due_date ?? '9999').localeCompare(String(b.due_date ?? '9999')) ||
					a.title.localeCompare(b.title)
			)[0] ?? null
	)
}

/** Done cards of all cards */
export const cardProgress = (/** @type {Card[]} */ cards) => ({
	done: cards.filter((card) => card.board_status === 'done').length,
	total: cards.length
})

const weekday = (/** @type {string} */ iso, /** @type {string} */ timeZone) =>
	new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone }).format(new Date(iso))

/**
 * The quiet line under a deadline: how far the tasks are, or when work is
 * planned for it, or that nothing is planned yet.
 * @param {{ tasks: { status: string, estimated_minutes: number | null }[], blocks: { starts_at: string }[], timeZone: string }} input
 */
export const deadlineLine = ({ tasks, blocks, timeZone }) => {
	if (tasks.length) {
		const done = tasks.filter((task) => task.status === 'done').length
		const left = tasks
			.filter((task) => task.status !== 'done')
			.reduce((sum, task) => sum + (task.estimated_minutes ?? 0), 0)
		return `${done} of ${tasks.length} tasks done${left ? ` · ${amount(left)} left` : ''}`
	}
	if (blocks.length) {
		const days = [...new Set(blocks.map((block) => weekday(block.starts_at, timeZone)))]
		return `planned ${days.length > 1 ? `${days.slice(0, -1).join(', ')} and ${days.at(-1)}` : days[0]}`
	}
	return 'not planned yet'
}

/** Whole minutes between two moments */
export const minutesBetween = (/** @type {string} */ from, /** @type {string} */ to) =>
	Math.max(0, Math.floor((new Date(to).getTime() - new Date(from).getTime()) / MINUTE))

/** "1:12" for the clock pill */
export const clockText = (/** @type {number} */ minutes) =>
	`${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`

/** "Clocked in for 1 hour 12 minutes on Summer campaign" */
export const clockSentence = (
	/** @type {number} */ minutes,
	/** @type {string | null} */ project
) => {
	const hours = Math.floor(minutes / 60)
	const rest = minutes % 60
	const parts = [
		hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '',
		rest || !hours ? `${rest} ${rest === 1 ? 'minute' : 'minutes'}` : ''
	].filter(Boolean)
	return `Clocked in for ${parts.join(' ')}${project ? ` on ${project}` : ''}`
}

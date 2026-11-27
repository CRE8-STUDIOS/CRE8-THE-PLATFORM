import { formatTime } from '#lib/utils/dates.js'

const MINUTE = 60_000
/** Gaps shorter than this are not worth a row */
export const MIN_FREE_MINUTES = 15
/** Types that count towards the planned hours of a week */
const PLANNED_TYPES = new Set(['work', 'meeting', 'errand', 'task'])

/**
 * @typedef {{
 *   id: string,
 *   type: string,
 *   title: string,
 *   starts_at: string | null,
 *   ends_at: string | null,
 *   all_day?: boolean | null,
 *   due_date?: string | null,
 *   status?: string | null,
 *   href?: string,
 *   is_protected?: boolean | null,
 *   energy?: string | null,
 *   location_name?: string | null,
 *   closes_at?: string | null,
 *   travel_before_minutes?: number | null,
 *   travel_after_minutes?: number | null,
 *   occurrence?: string | null,
 *   address?: string | null,
 *   meeting_url?: string | null,
 *   project_id?: string | null,
 *   priority?: string | null,
 *   estimated_minutes?: number | null,
 *   projects?: { title: string } | null
 * }} AgendaItem
 *
 * @typedef {{ kind: 'item', item: AgendaItem, start: string, end: string | null }
 *   | { kind: 'travel', start: string, end: string, minutes: number }
 *   | { kind: 'free', start: string, end: string, minutes: number }} TimelineRow
 */

/** A focus block: protected or creative work, drawn with the strong line */
export const isFocus = (/** @type {AgendaItem} */ item) =>
	item.type === 'work' && Boolean(item.is_protected || item.energy === 'creative')

/** The one label shown on an item */
export const typeLabel = (/** @type {AgendaItem} */ item) =>
	isFocus(item) ? 'Focus' : item.type.charAt(0).toUpperCase() + item.type.slice(1)

/** "09:00" style time of an opening hour such as "17:00:00" */
const clock = (/** @type {string} */ time) => time.slice(0, 5)

/**
 * The single quiet line under an item title.
 * @param {AgendaItem} item
 * @param {string} timeZone
 */
export const subLine = (item, timeZone) => {
	const until = item.ends_at ? `until ${formatTime(item.ends_at, timeZone)}` : null
	switch (item.type) {
		case 'work':
			return [until, item.is_protected ? 'protected' : null].filter(Boolean).join(' · ')
		case 'meeting':
			return item.location_name ?? until ?? ''
		case 'errand':
			return item.closes_at ? `open until ${clock(item.closes_at)}` : (item.location_name ?? '')
		case 'task':
		case 'deadline':
			return item.projects?.title ?? ''
		default:
			return ''
	}
}

const minutesBetween = (/** @type {string} */ start, /** @type {string} */ end) =>
	Math.round((new Date(end).getTime() - new Date(start).getTime()) / MINUTE)

const shift = (/** @type {string} */ iso, /** @type {number} */ minutes) =>
	new Date(new Date(iso).getTime() + minutes * MINUTE).toISOString()

/**
 * Rows for one day: travel before, the item, travel after, and free time
 * between them. Items must be timed (not all day).
 * @param {AgendaItem[]} items
 * @returns {TimelineRow[]}
 */
export const buildTimeline = (items) => {
	const timed = items
		.filter((item) => item.starts_at && !item.all_day)
		.sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))

	/** @type {TimelineRow[]} */
	const rows = []
	/** @type {string | null} */
	let busyUntil = null

	for (const item of timed) {
		const start = /** @type {string} */ (item.starts_at)
		const end = item.ends_at ?? start
		const before = item.travel_before_minutes ?? 0
		const after = item.travel_after_minutes ?? 0
		const leaveAt = before ? shift(start, -before) : start

		if (busyUntil && minutesBetween(busyUntil, leaveAt) >= MIN_FREE_MINUTES) {
			rows.push({
				kind: 'free',
				start: busyUntil,
				end: leaveAt,
				minutes: minutesBetween(busyUntil, leaveAt)
			})
		}
		if (before) rows.push({ kind: 'travel', start: leaveAt, end: start, minutes: before })
		rows.push({ kind: 'item', item, start, end: item.ends_at })
		if (after) rows.push({ kind: 'travel', start: end, end: shift(end, after), minutes: after })

		const finished = after ? shift(end, after) : end
		if (!busyUntil || finished > busyUntil) busyUntil = finished
	}
	return rows
}

/**
 * Planned hours in a list of items, rounded to half hours.
 * @param {AgendaItem[]} items
 */
export const plannedHours = (items) => {
	const minutes = items
		.filter(
			(item) => PLANNED_TYPES.has(item.type) && item.starts_at && item.ends_at && !item.all_day
		)
		.reduce(
			(total, item) =>
				total +
				minutesBetween(
					/** @type {string} */ (item.starts_at),
					/** @type {string} */ (item.ends_at)
				),
			0
		)
	return Math.round((minutes / 60) * 2) / 2
}

/** Link to an item's details; repeating items carry the date that was clicked */
export const itemHref = (/** @type {AgendaItem} */ item) =>
	item.href ?? `/agenda/${item.id}${item.occurrence ? `?on=${item.occurrence}` : ''}`

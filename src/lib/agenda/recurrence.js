import { addDays, mondayOf, toLocalInput, toUtcIso } from '#lib/utils/dates.js'

const WEEKDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
const SAFETY_LIMIT = 2000

/**
 * @typedef {{ freq: 'DAILY' | 'WEEKLY' | 'MONTHLY', interval: number, byDay: number[], count: number | null, until: string | null }} Rule
 */

/**
 * Reads the supported part of an iCalendar RRULE, for example "FREQ=WEEKLY;BYDAY=MO,WE".
 * Returns null for an empty or unsupported rule, so the item shows once.
 * @param {string | null | undefined} text
 * @returns {Rule | null}
 */
export const parseRule = (text) => {
	if (!text) return null
	/** @type {Record<string, string>} */
	const parts = {}
	for (const pair of text.replace(/^RRULE:/i, '').split(';')) {
		const [key, value] = pair.split('=')
		if (key && value) parts[key.trim().toUpperCase()] = value.trim().toUpperCase()
	}

	const freq = parts.FREQ
	if (freq !== 'DAILY' && freq !== 'WEEKLY' && freq !== 'MONTHLY') return null

	const interval = Math.max(1, Number.parseInt(parts.INTERVAL ?? '1', 10) || 1)
	const byDay = (parts.BYDAY ?? '')
		.split(',')
		.map((day) => WEEKDAYS.indexOf(day.slice(-2)))
		.filter((index) => index >= 0)
	const count = parts.COUNT ? Number.parseInt(parts.COUNT, 10) || null : null
	const until = parts.UNTIL
		? `${parts.UNTIL.slice(0, 4)}-${parts.UNTIL.slice(4, 6)}-${parts.UNTIL.slice(6, 8)}`
		: null

	return { freq, interval, byDay, count, until }
}

/** @param {string} ymd */
const weekdayIndex = (ymd) => (new Date(`${ymd}T12:00:00Z`).getUTCDay() + 6) % 7

/** @param {string} ymd @param {number} months */
const addMonths = (ymd, months) => {
	const [year, month, day] = ymd.split('-').map(Number)
	const date = new Date(Date.UTC(year, month - 1 + months, 1, 12))
	const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
	if (day > lastDay) return null
	date.setUTCDate(day)
	return date.toISOString().slice(0, 10)
}

/**
 * Local dates the rule produces, from the first date on, in order.
 * @param {Rule} rule
 * @param {string} first
 * @returns {Generator<string>}
 */
function* datesOf(rule, first) {
	if (rule.freq === 'DAILY') {
		for (let date = first; ; date = addDays(date, rule.interval)) yield date
	}

	if (rule.freq === 'WEEKLY') {
		const days = rule.byDay.length ? [...rule.byDay].sort() : [weekdayIndex(first)]
		for (let monday = mondayOf(first); ; monday = addDays(monday, 7 * rule.interval)) {
			for (const day of days) {
				const date = addDays(monday, day)
				if (date >= first) yield date
			}
		}
	}

	for (let step = 0; ; step += rule.interval) {
		const date = addMonths(first, step)
		if (date) yield date
	}
}

/**
 * Expands a repeating item into the occurrences that start in [from, to).
 * Times stay the same on the wall clock, also across daylight saving changes.
 * Dates in recurrence_exceptions are skipped (removed or changed one by one).
 * Items without a rule come back unchanged when they start in the range.
 * @template {{ starts_at: string | null, ends_at: string | null, recurrence_rule?: string | null, recurrence_until?: string | null, recurrence_exceptions?: string[] | null }} T
 * @param {T} item
 * @param {string} from first local date, YYYY-MM-DD
 * @param {string} to local date after the range, YYYY-MM-DD
 * @param {string} timeZone
 * @returns {(T & { occurrence: string | null })[]}
 */
export const expandItem = (item, from, to, timeZone) => {
	if (!item.starts_at) return []
	const rule = parseRule(item.recurrence_rule)
	const local = toLocalInput(item.starts_at, timeZone)
	const firstDate = local.slice(0, 10)

	if (!rule) return firstDate >= from && firstDate < to ? [{ ...item, occurrence: null }] : []

	const time = local.slice(11, 16)
	const duration = item.ends_at
		? new Date(item.ends_at).getTime() - new Date(item.starts_at).getTime()
		: null
	const until = [rule.until, item.recurrence_until ?? null].filter(Boolean).sort().at(0)

	const occurrences = []
	let made = 0
	for (const date of datesOf(rule, firstDate)) {
		if (date >= to || (until && date > until) || made >= SAFETY_LIMIT) break
		if (rule.count !== null && made >= rule.count) break
		made += 1
		if (date < from || item.recurrence_exceptions?.includes(date)) continue

		const startsAt = /** @type {string} */ (toUtcIso(`${date}T${time}`, timeZone))
		occurrences.push({
			...item,
			starts_at: startsAt,
			ends_at:
				duration === null ? null : new Date(new Date(startsAt).getTime() + duration).toISOString(),
			occurrence: date
		})
	}
	return occurrences
}

import { addDays, mondayOf, toLocalInput } from '#lib/utils/dates.js'

/** The week grid shows at least this span, and grows to fit earlier or later items */
export const WEEK_START_HOUR = 8
export const WEEK_END_HOUR = 20
/** Rows per hour in the week grid */
export const SLOTS_PER_HOUR = 2
/** Most item names in a month cell before "+N" */
export const MONTH_CELL_ITEMS = 2

/**
 * @typedef {import('./timeline.js').AgendaItem} AgendaItem
 * @typedef {{ item: AgendaItem, row: number, span: number }} PlacedItem
 */

/** Minutes after midnight of a local "YYYY-MM-DDTHH:mm" */
const minutesOfDay = (/** @type {string} */ local) =>
	Number(local.slice(11, 13)) * 60 + Number(local.slice(14, 16))

/**
 * Places a week of timed items on a grid of half hour rows.
 * Row 1 of a day is the first slot, so callers add their header rows.
 * @param {AgendaItem[]} items
 * @param {string} monday
 * @param {string} timeZone
 */
export const weekLayout = (items, monday, timeZone) => {
	const timed = items
		.filter((item) => item.starts_at && !item.all_day)
		.map((item) => {
			const start = toLocalInput(item.starts_at, timeZone)
			const end = item.ends_at ? toLocalInput(item.ends_at, timeZone) : null
			const startMinutes = minutesOfDay(start)
			const sameDayEnd = end && end.slice(0, 10) === start.slice(0, 10)
			const endMinutes = end ? (sameDayEnd ? minutesOfDay(end) : 24 * 60) : startMinutes + 30
			return {
				item,
				date: start.slice(0, 10),
				startMinutes,
				endMinutes: Math.max(endMinutes, startMinutes + 30)
			}
		})

	const firstHour = Math.min(
		WEEK_START_HOUR,
		...timed.map(({ startMinutes }) => Math.floor(startMinutes / 60))
	)
	const lastHour = Math.max(
		WEEK_END_HOUR,
		...timed.map(({ endMinutes }) => Math.ceil(endMinutes / 60))
	)
	const slotMinutes = 60 / SLOTS_PER_HOUR
	const toRow = (/** @type {number} */ minutes) =>
		Math.floor((minutes - firstHour * 60) / slotMinutes) + 1

	const days = Array.from({ length: 7 }, (_, index) => {
		const date = addDays(monday, index)
		return {
			date,
			weekend: index >= 5,
			allDay: items.filter(
				(item) => (item.all_day || !item.starts_at) && dateOf(item, timeZone) === date
			),
			/** @type {PlacedItem[]} */
			placed: timed
				.filter((entry) => entry.date === date)
				.map(({ item, startMinutes, endMinutes }) => {
					const row = toRow(startMinutes)
					return { item, row, span: Math.max(1, toRow(endMinutes) - row) }
				})
		}
	})

	const hours = Array.from({ length: lastHour - firstHour }, (_, index) => ({
		label: `${String(firstHour + index).padStart(2, '0')}:00`,
		row: index * SLOTS_PER_HOUR + 1
	}))

	return { days, hours, slots: (lastHour - firstHour) * SLOTS_PER_HOUR }
}

/**
 * The local date an item belongs to: its start, or its due date when it has no time.
 * @param {AgendaItem & { due_date?: string | null }} item
 * @param {string} timeZone
 */
export const dateOf = (item, timeZone) =>
	item.starts_at ? toLocalInput(item.starts_at, timeZone).slice(0, 10) : (item.due_date ?? null)

/**
 * Six weeks of month cells, Monday first.
 * @param {string} month YYYY-MM
 * @param {(AgendaItem & { due_date?: string | null })[]} items
 * @param {string} today
 * @param {string} timeZone
 */
export const monthCells = (month, items, today, timeZone) => {
	const first = mondayOf(`${month}-01`)
	return Array.from({ length: 42 }, (_, index) => {
		const date = addDays(first, index)
		const onDay = items
			.filter((item) => dateOf(item, timeZone) === date)
			.sort((a, b) => Number(b.type === 'deadline') - Number(a.type === 'deadline'))
		return {
			date,
			day: Number(date.slice(8, 10)),
			inMonth: date.slice(0, 7) === month,
			today: date === today,
			items: onDay.slice(0, MONTH_CELL_ITEMS),
			more: Math.max(0, onDay.length - MONTH_CELL_ITEMS)
		}
	})
}

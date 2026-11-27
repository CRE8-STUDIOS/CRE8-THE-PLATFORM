import { addDays, toLocalInput } from '#lib/utils/dates.js'
import { addToTime, chosenDay, chosenMinutes, deadlineDay } from './answers.js'

/** Working hours used when the user has not set any for a day */
export const DEFAULT_HOURS = { starts_at: '09:00', ends_at: '17:00' }
/** How many days "find a time for me" looks ahead, today included */
export const SEARCH_DAYS = 7
/** Errand slots start on a quarter hour */
const STEP = 15

/**
 * @typedef {import('./timeline.js').AgendaItem} AgendaItem
 * @typedef {{ weekday: number, starts_at: string, ends_at: string }} WorkingHours
 * @typedef {{ today: string, now: string, timeZone: string, items: AgendaItem[], workingHours: WorkingHours[] }} FitContext
 * @typedef {{ start: number, end: number, title: string }} Block
 */

/** Minutes after midnight of "HH:MM" */
export const toMinutes = (/** @type {string} */ time) =>
	Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))

/** "HH:MM" of minutes after midnight */
export const toClock = (/** @type {number} */ minutes) =>
	`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/** "3 h 30", "1 h" or "45 min" */
export const amount = (/** @type {number} */ minutes) => {
	const hours = Math.floor(minutes / 60)
	const rest = minutes % 60
	if (!hours) return `${rest} min`
	return rest ? `${hours} h ${String(rest).padStart(2, '0')}` : `${hours} h`
}

/** ISO weekday, 1 is Monday */
const isoWeekday = (/** @type {string} */ day) =>
	((new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7) + 1

/** "today", "tomorrow" or "on Fri 4 Dec" */
export const dayWord = (/** @type {string} */ day, /** @type {string} */ today) => {
	if (day === today) return 'today'
	if (day === addDays(today, 1)) return 'tomorrow'
	const label = new Intl.DateTimeFormat('en-GB', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC'
	}).format(new Date(`${day}T12:00:00Z`))
	return `on ${label}`
}

/**
 * Busy blocks on one local day, travel included, in minutes after midnight.
 * @param {AgendaItem[]} items
 * @param {string} day
 * @param {string} timeZone
 * @returns {Block[]}
 */
export const busyOn = (items, day, timeZone) =>
	items
		.filter((item) => item.starts_at && item.status !== 'done')
		.flatMap((item) => {
			const start = toLocalInput(item.starts_at, timeZone)
			if (item.all_day)
				return start.slice(0, 10) === day ? [{ start: 0, end: 24 * 60, title: item.title }] : []
			const end = item.ends_at ? toLocalInput(item.ends_at, timeZone) : start
			if (end.slice(0, 10) < day || start.slice(0, 10) > day) return []
			const from = start.slice(0, 10) < day ? 0 : toMinutes(start.slice(11, 16))
			const to = end.slice(0, 10) > day ? 24 * 60 : toMinutes(end.slice(11, 16))
			return [
				{
					start: Math.max(0, from - (item.travel_before_minutes ?? 0)),
					end: Math.min(24 * 60, to + (item.travel_after_minutes ?? 0)),
					title: item.title
				}
			]
		})
		.sort((a, b) => a.start - b.start)

/**
 * Working windows of a day in minutes, or the default when none are set.
 * @param {WorkingHours[]} workingHours
 * @param {string} day
 */
export const windowsOn = (workingHours, day) => {
	const own = workingHours.filter((row) => row.weekday === isoWeekday(day))
	return (own.length ? own : [DEFAULT_HOURS])
		.map((row) => ({ start: toMinutes(row.starts_at), end: toMinutes(row.ends_at) }))
		.sort((a, b) => a.start - b.start)
}

/**
 * Free gaps inside the windows, after the busy blocks are taken out.
 * @param {{ start: number, end: number }[]} windows
 * @param {Block[]} busy
 */
export const freeGaps = (windows, busy) =>
	windows.flatMap((window) => {
		const gaps = []
		let cursor = window.start
		for (const block of busy) {
			if (block.end <= cursor || block.start >= window.end) continue
			if (block.start > cursor) gaps.push({ start: cursor, end: block.start })
			cursor = Math.max(cursor, block.end)
		}
		if (cursor < window.end) gaps.push({ start: cursor, end: window.end })
		return gaps
	})

/** Minutes after midnight of now on today, rounded up to the next quarter */
const nowMinutes = (/** @type {FitContext} */ context) => {
	const local = toLocalInput(context.now, context.timeZone)
	return Math.ceil(toMinutes(local.slice(11, 16)) / STEP) * STEP
}

/**
 * Free minutes left on a day inside working hours. On today only from now on.
 * @param {string} day
 * @param {FitContext} context
 */
export const freeMinutes = (day, context) => {
	const from = day === context.today ? nowMinutes(context) : 0
	return freeGaps(
		windowsOn(context.workingHours, day),
		busyOn(context.items, day, context.timeZone)
	)
		.map((gap) => ({ start: Math.max(gap.start, from), end: gap.end }))
		.filter((gap) => gap.end > gap.start)
		.reduce((total, gap) => total + gap.end - gap.start, 0)
}

/**
 * The first busy block that overlaps a new block, travel included.
 * @param {string} day
 * @param {number} start
 * @param {number} end
 * @param {number} travel minutes before and after
 * @param {FitContext} context
 */
export const overlapOn = (day, start, end, travel, context) =>
	busyOn(context.items, day, context.timeZone).find(
		(block) => block.start < end + travel && block.end > start - travel
	) ?? null

/**
 * First free moment for an errand, inside working hours and opening hours.
 * @param {{ opens: string, closes: string, minutes: number }} errand
 * @param {FitContext} context
 * @returns {{ day: string, from: string, to: string } | null}
 */
export const findErrandSlot = ({ opens, closes, minutes }, context) => {
	const open = { start: toMinutes(opens), end: toMinutes(closes) }
	for (let offset = 0; offset < SEARCH_DAYS; offset++) {
		const day = addDays(context.today, offset)
		const earliest = day === context.today ? nowMinutes(context) : 0
		const windows = windowsOn(context.workingHours, day)
			.map((window) => ({
				start: Math.max(window.start, open.start, earliest),
				end: Math.min(window.end, open.end)
			}))
			.filter((window) => window.end > window.start)
		const gap = freeGaps(windows, busyOn(context.items, day, context.timeZone)).find(
			(free) => free.end - Math.ceil(free.start / STEP) * STEP >= minutes
		)
		if (gap) {
			const start = Math.ceil(gap.start / STEP) * STEP
			return { day, from: toClock(start), to: toClock(start + minutes) }
		}
	}
	return null
}

const PRIORITY_WORDS = /** @type {Record<string, string>} */ ({
	must: 'must have',
	should: 'should have',
	could: 'could have',
	wont: "won't this time"
})

const REST_WORDS = /** @type {Record<string, string>} */ ({
	lunch: 'Lunch',
	break: 'A break',
	day_off: 'A day off',
	holiday: 'Holiday'
})

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

/**
 * The fit line for a timed block, or a question when the times are not filled in.
 * @param {string | null} day
 * @param {string | undefined} from
 * @param {string | undefined} to
 * @param {number} travel
 * @param {FitContext} context
 */
const blockFit = (day, from, to, travel, context) => {
	if (!day) return { ok: false, text: 'Which day?' }
	if (!TIME.test(from ?? '') || !TIME.test(to ?? ''))
		return { ok: false, text: 'From when to when?' }
	if (/** @type {string} */ (to) <= /** @type {string} */ (from))
		return { ok: false, text: 'The end has to be after the start.' }
	const start = toMinutes(/** @type {string} */ (from))
	const end = toMinutes(/** @type {string} */ (to))
	const clash = overlapOn(day, start, end, travel, context)
	if (clash)
		return {
			ok: false,
			text: `This overlaps with ${clash.title} ${toClock(clash.start)} to ${toClock(clash.end)}.`
		}
	return { ok: true, text: '' }
}

/**
 * One sentence that says what will be added and if it fits.
 * @param {string} type
 * @param {Record<string, string>} answers
 * @param {FitContext} context
 */
export const describeAdd = (type, answers, context) => {
	const { today } = context

	if (type === 'task') {
		const priority = PRIORITY_WORDS[answers.priority] ?? 'should have'
		const minutes = chosenMinutes(answers)
		const length = minutes ? `, ${amount(minutes)}` : ''
		if (answers.day === 'none')
			return `A task without a date, ${priority}${length}. It waits in tasks without a date.`
		const day = chosenDay(answers, today)
		if (!day) return 'Which day?'
		const free = freeMinutes(day, context)
		const word = dayWord(day, today)
		const left =
			minutes && minutes > free
				? `That is more than the ${amount(free)} you have free ${word}.`
				: `You still have ${amount(free)} free ${word}.`
		return `A task for ${word.replace(/^on /, '')}, ${priority}${length}. ${left}`
	}

	if (type === 'meeting') {
		const day = chosenDay(answers, today)
		const travel = answers.where === 'in_person' ? Number(answers.travel ?? 0) || 0 : 0
		const fit = blockFit(day, answers.from, answers.to, travel, context)
		if (!fit.ok) return fit.text
		const way = travel ? `, with ${amount(travel)} travel each way` : ''
		return `Meeting ${dayWord(/** @type {string} */ (day), today)} ${answers.from} to ${answers.to}${way}. It fits.`
	}

	if (type === 'work') {
		const day = chosenDay(answers, today)
		const fit = blockFit(day, answers.from, answers.to, 0, context)
		if (!fit.ok) return fit.text
		const kind = { creative: 'Creative work', admin: 'Admin work' }[answers.kind] ?? 'Work'
		const protect = answers.protect === 'on' ? ', protected' : ''
		const clock =
			answers.clock_in === 'on' ? ` You get a clock in question at ${answers.from}.` : ''
		return `${kind} ${dayWord(/** @type {string} */ (day), today)} ${answers.from} to ${answers.to}${protect}.${clock}`
	}

	if (type === 'errand') {
		const place = (answers.location ?? '').trim() || 'The place'
		if (!TIME.test(answers.opens ?? '') || !TIME.test(answers.closes ?? ''))
			return 'When is it open?'
		if (answers.closes <= answers.opens) return 'It has to close after it opens.'
		const minutes = Number(answers.duration) || 30
		if (answers.timing === 'pick') {
			const day = chosenDay(answers, today)
			const end = TIME.test(answers.from ?? '') ? addToTime(answers.from, minutes) : null
			if (!day || !end) return 'Which day and time?'
			if (answers.from < answers.opens || end > answers.closes)
				return `${place} is closed then. It is open ${answers.opens} to ${answers.closes}.`
			const fit = blockFit(day, answers.from, end, 0, context)
			if (!fit.ok) return fit.text
			return `Errand ${dayWord(day, today)} ${answers.from} to ${end}. ${place} is open until ${answers.closes}.`
		}
		const slot = findErrandSlot({ opens: answers.opens, closes: answers.closes, minutes }, context)
		if (!slot)
			return `No free moment while ${place.toLowerCase() === 'the place' ? 'it' : place} is open this week. Pick a time yourself.`
		return `Best moment: ${dayWord(slot.day, today)} ${slot.from} to ${slot.to}. ${place} is open until ${answers.closes}.`
	}

	if (type === 'deadline') {
		const day = deadlineDay(answers, today)
		if (!day) return 'Which date?'
		const daysBefore = Number(answers.heads_up) || 3
		const format = (
			/** @type {string} */ date,
			/** @type {Intl.DateTimeFormatOptions} */ options
		) =>
			new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(
				new Date(`${date}T12:00:00Z`)
			)
		const remind = addDays(day, -daysBefore)
		const when =
			remind <= today
				? 'I will remind you right away.'
				: `I will remind you on ${format(remind, daysBefore >= 7 ? { weekday: 'long', day: 'numeric', month: 'short' } : { weekday: 'long' })}.`
		return `Deadline ${format(day, { weekday: 'long', day: 'numeric', month: 'short' })}. ${when}`
	}

	if (type === 'rest') {
		const what = REST_WORDS[answers.kind] ?? 'Rest'
		const day = chosenDay(answers, today)
		if (answers.kind === 'day_off' || answers.kind === 'holiday') {
			if (!day) return 'Which day?'
			return `${what} ${dayWord(day, today)}. Enjoy it.`
		}
		const fit = blockFit(day, answers.from, answers.to, 0, context)
		if (!fit.ok) return fit.text
		const lock = answers.lock === 'on' ? ', locked' : ''
		return `${what} ${dayWord(/** @type {string} */ (day), today)} ${answers.from} to ${answers.to}${lock}. Good call.`
	}

	return ''
}

import { addDays, mondayOf, toUtcIso } from '#lib/utils/dates.js'

/** Types that can be added in version 1, in the order of step 1 */
export const ADD_TYPES = ['task', 'meeting', 'work', 'errand', 'deadline', 'rest']

export const PRIORITIES = ['must', 'should', 'could', 'wont']
export const TASK_MINUTES = ['15', '30', '60', '120', 'other']
export const ERRAND_MINUTES = ['15', '30', '45', '60']
export const TRAVEL_MINUTES = ['0', '15', '30', '45', '60']
export const WHERE = ['in_person', 'online', 'phone']
export const WORK_KINDS = ['creative', 'admin', 'other']
export const REST_KINDS = ['lunch', 'break', 'day_off', 'holiday']
export const HEADS_UP_DAYS = ['1', '3', '7']
export const REMINDERS = ['', '0', '15', '60', '1440']
export const REPEATS = ['', 'daily', 'weekly', 'monthly']

const REST_TITLES = /** @type {Record<string, string>} */ ({
	lunch: 'Lunch',
	break: 'Break',
	day_off: 'Day off',
	holiday: 'Holiday'
})

const RULES = /** @type {Record<string, string>} */ ({
	daily: 'FREQ=DAILY',
	weekly: 'FREQ=WEEKLY',
	monthly: 'FREQ=MONTHLY'
})

/** @typedef {Record<string, string>} Answers */
/** @typedef {Record<string, string>} Errors */

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

/** @param {string | undefined} value @param {string[]} allowed @param {string} fallback */
const pick = (value, allowed, fallback) =>
	value !== undefined && allowed.includes(value) ? value : fallback

/**
 * The day an answer points to: today, tomorrow, a picked date, or null.
 * @param {Answers} answers
 * @param {string} today
 */
export const chosenDay = (answers, today) => {
	switch (answers.day) {
		case 'today':
			return today
		case 'tomorrow':
			return addDays(today, 1)
		case 'pick':
			return DATE.test(answers.date ?? '') ? answers.date : null
		default:
			return null
	}
}

/** Friday of this week, or of next week, for deadlines */
export const fridayFrom = (/** @type {string} */ today, /** @type {number} */ weeks) => {
	const friday = addDays(mondayOf(today), 4 + weeks * 7)
	return weeks === 0 && friday < today ? addDays(friday, 7) : friday
}

/** @param {Answers} answers @param {string} today */
export const deadlineDay = (answers, today) => {
	if (answers.due === 'this_friday') return fridayFrom(today, 0)
	if (answers.due === 'next_friday') return fridayFrom(today, 1)
	return DATE.test(answers.date ?? '') ? answers.date : null
}

/** Minutes from a duration answer, including OTHER */
export const chosenMinutes = (/** @type {Answers} */ answers) => {
	if (answers.duration === 'other') {
		const minutes = Number(answers.minutes)
		return Number.isInteger(minutes) && minutes > 0 && minutes <= 24 * 60 ? minutes : null
	}
	const minutes = Number(answers.duration)
	return Number.isFinite(minutes) && minutes > 0 ? minutes : null
}

/** "HH:MM" plus minutes, or null past midnight */
export const addToTime = (/** @type {string} */ time, /** @type {number} */ minutes) => {
	const total = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) + minutes
	if (total >= 24 * 60) return null
	return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/**
 * Checks a from and to answer on a day.
 * @param {Answers} answers
 * @param {string | null} day
 * @param {Errors} errors
 */
const checkTimes = (answers, day, errors) => {
	if (!day) errors.day = 'Pick a day.'
	if (!TIME.test(answers.from ?? '')) errors.from = 'Fill in a start time.'
	if (!TIME.test(answers.to ?? '')) errors.to = 'Fill in an end time.'
	else if (TIME.test(answers.from ?? '') && answers.to <= answers.from)
		errors.to = 'The end has to be after the start.'
}

/**
 * Turns the tap answers of one type into agenda_items values.
 * Shared by the server action and the live preview.
 * @param {string} type
 * @param {Answers} answers
 * @param {{ today: string, timeZone: string }} context
 * @returns {{ values: Record<string, unknown>, errors: Errors }}
 */
export const answersToItem = (type, answers, { today, timeZone }) => {
	/** @type {Errors} */
	const errors = {}
	const title = (answers.title ?? '').trim()
	const at = (/** @type {string | null} */ day, /** @type {string | undefined} */ time) =>
		day && time && TIME.test(time) ? toUtcIso(`${day}T${time}`, timeZone) : null

	/** @type {Record<string, unknown>} */
	const values = {
		type,
		title,
		project_id: answers.project_id || null,
		description: (answers.notes ?? '').trim() || null,
		reminder_minutes: answers.reminder ? [Number(pick(answers.reminder, REMINDERS, '0'))] : [],
		recurrence_rule: RULES[pick(answers.repeat, REPEATS, '')] ?? null
	}

	if (type !== 'rest' && !title) errors.title = 'Give it a title.'
	if (title.length > 200) errors.title = 'Keep the title under 200 characters.'

	if (type === 'task') {
		const day = answers.day === 'none' ? null : chosenDay(answers, today)
		if (answers.day === 'pick' && !day) errors.day = 'Pick a day.'
		const minutes = chosenMinutes(answers)
		if (answers.duration === 'other' && minutes === null) errors.duration = 'Fill in the minutes.'
		Object.assign(values, {
			due_date: day,
			starts_at: null,
			ends_at: null,
			priority: pick(answers.priority, PRIORITIES, 'should'),
			estimated_minutes: minutes,
			recurrence_rule: null
		})
	}

	if (type === 'meeting' || type === 'work') {
		const day = chosenDay(answers, today)
		checkTimes(answers, day, errors)
		Object.assign(values, { starts_at: at(day, answers.from), ends_at: at(day, answers.to) })
	}

	if (type === 'meeting') {
		const where = pick(answers.where, WHERE, 'in_person')
		const travel = where === 'in_person' ? Number(pick(answers.travel, TRAVEL_MINUTES, '0')) : 0
		const url = (answers.meeting_url ?? '').trim()
		if (where === 'online' && url && !/^https?:\/\/\S+$/i.test(url))
			errors.meeting_url = 'Use a full link that starts with https://'
		Object.assign(values, {
			address: where === 'in_person' ? (answers.address ?? '').trim() || null : null,
			location_name: where === 'phone' ? 'Phone' : where === 'online' ? 'Online' : null,
			meeting_url: where === 'online' ? url || null : null,
			travel_before_minutes: travel,
			travel_after_minutes: travel
		})
	}

	if (type === 'work') {
		Object.assign(values, {
			energy: pick(answers.kind, WORK_KINDS, 'creative'),
			is_protected: answers.protect === 'on',
			clock_in_prompt: answers.clock_in === 'on'
		})
	}

	if (type === 'errand') {
		if (!TIME.test(answers.opens ?? '')) errors.opens = 'Fill in when it opens.'
		if (!TIME.test(answers.closes ?? '')) errors.closes = 'Fill in when it closes.'
		else if (TIME.test(answers.opens ?? '') && answers.closes <= answers.opens)
			errors.closes = 'It has to close after it opens.'
		const minutes = Number(pick(answers.duration, ERRAND_MINUTES, '30'))
		Object.assign(values, {
			location_name: (answers.location ?? '').trim() || null,
			opens_at: TIME.test(answers.opens ?? '') ? answers.opens : null,
			closes_at: TIME.test(answers.closes ?? '') ? answers.closes : null,
			estimated_minutes: minutes,
			starts_at: null,
			ends_at: null
		})
		if (answers.timing === 'pick') {
			const day = chosenDay(answers, today)
			if (!day) errors.day = 'Pick a day.'
			if (!TIME.test(answers.from ?? '')) errors.from = 'Fill in a time.'
			const end = TIME.test(answers.from ?? '') ? addToTime(answers.from, minutes) : null
			if (TIME.test(answers.from ?? '') && !end) errors.from = 'That runs past midnight.'
			values.starts_at = at(day, answers.from)
			values.ends_at = at(day, end ?? undefined)
		}
	}

	if (type === 'deadline') {
		const day = deadlineDay(answers, today)
		if (!day) errors.date = 'Pick a date.'
		const days = Number(pick(answers.heads_up, HEADS_UP_DAYS, '3'))
		Object.assign(values, {
			due_date: day,
			starts_at: null,
			ends_at: null,
			reminder_minutes: [days * 24 * 60]
		})
	}

	if (type === 'rest') {
		const kind = pick(answers.kind, REST_KINDS, 'lunch')
		const allDay = kind === 'day_off' || kind === 'holiday'
		const day = chosenDay(answers, today)
		if (allDay) {
			if (!day) errors.day = 'Pick a day.'
		} else checkTimes(answers, day, errors)
		Object.assign(values, {
			title: title || REST_TITLES[kind],
			all_day: allDay,
			starts_at: allDay ? at(day, '00:00') : at(day, answers.from),
			ends_at: allDay ? null : at(day, answers.to),
			is_protected: answers.lock === 'on'
		})
	}

	return { values, errors }
}

/**
 * Reads a form into plain answers. Repeated fields (checklist, people) stay lists.
 * @param {FormData} formData
 */
export const readAnswers = (formData) => {
	/** @type {Answers} */
	const answers = {}
	for (const [key, value] of formData) {
		if (typeof value === 'string' && !(key in answers)) answers[key] = value
	}
	return answers
}

/**
 * Checklist lines and people from the extra options.
 * @param {FormData} formData
 */
export const readExtras = (formData) => {
	const checklist = String(formData.get('checklist') ?? '')
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.slice(0, 50)

	const names = formData.getAll('person_name').map(String)
	const people = names
		.map((name, index) => ({
			name: name.trim(),
			role: String(formData.getAll('person_role')[index] ?? '').trim() || null,
			email: String(formData.getAll('person_email')[index] ?? '').trim() || null,
			phone: String(formData.getAll('person_phone')[index] ?? '').trim() || null
		}))
		.filter((person) => person.name)

	return { checklist, people }
}

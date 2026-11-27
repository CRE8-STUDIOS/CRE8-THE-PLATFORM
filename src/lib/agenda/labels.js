import { addDays } from '#lib/utils/dates.js'

const format = (/** @type {string} */ ymd, /** @type {Intl.DateTimeFormatOptions} */ options) =>
	new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(
		new Date(`${ymd}T12:00:00Z`)
	)

/** "Friday 27 Nov" */
export const dayTitle = (/** @type {string} */ date) =>
	format(date, { weekday: 'long', day: 'numeric', month: 'short' })

/** "23 to 29 Nov", or "30 Nov to 6 Dec" across months */
export const weekTitle = (/** @type {string} */ monday) => {
	const sunday = addDays(monday, 6)
	const sameMonth = monday.slice(0, 7) === sunday.slice(0, 7)
	const start = sameMonth
		? format(monday, { day: 'numeric' })
		: format(monday, { day: 'numeric', month: 'short' })
	return `${start} to ${format(sunday, { day: 'numeric', month: 'short' })}`
}

/** "November", with the year when it is not this year */
export const monthTitle = (/** @type {string} */ month, /** @type {string} */ today) =>
	format(`${month}-01`, {
		month: 'long',
		...(month.slice(0, 4) === today.slice(0, 4) ? {} : { year: 'numeric' })
	})

/** 26 or 26.5 */
export const hoursText = (/** @type {number} */ hours) =>
	Number.isInteger(hours) ? String(hours) : hours.toFixed(1)

/** YYYY-MM from a query value, or the fallback */
export const monthParam = (/** @type {string | null} */ value, /** @type {string} */ fallback) =>
	value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : fallback

/** The month before or after YYYY-MM */
export const shiftMonth = (/** @type {string} */ month, /** @type {number} */ step) => {
	const date = new Date(`${month}-01T12:00:00Z`)
	date.setUTCMonth(date.getUTCMonth() + step)
	return date.toISOString().slice(0, 7)
}

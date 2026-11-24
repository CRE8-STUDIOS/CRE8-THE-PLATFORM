// Date helpers that work with the freelancer's time zone (profiles.timezone).
// The database stores moments in UTC; forms and screens use local time.

/** Offset in ms between a time zone and UTC at a given moment. */
const timeZoneOffset = (/** @type {Date} */ date, /** @type {string} */ timeZone) => {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).formatToParts(date)

	/** @type {Record<string, number>} */
	const values = {}
	for (const { type, value } of parts) if (type !== 'literal') values[type] = Number(value)

	const { year, month, day, hour, minute, second } = values
	const asUtc = Date.UTC(year, month - 1, day, hour, minute, second)
	return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

/**
 * Local date/time text ("2026-11-25T10:00" or "2026-11-25") in a time zone -> UTC ISO string.
 * @param {string | null} local
 * @param {string} timeZone
 */
export const toUtcIso = (local, timeZone) => {
	if (!local) return null
	const withTime = local.length === 10 ? `${local}T00:00` : local
	const guess = new Date(`${withTime}:00Z`)
	const firstTry = new Date(guess.getTime() - timeZoneOffset(guess, timeZone))
	// correct once around daylight-saving changes
	return new Date(guess.getTime() - timeZoneOffset(firstTry, timeZone)).toISOString()
}

/**
 * UTC ISO string -> value for <input type="datetime-local"> in a time zone.
 * @param {string | null | undefined} iso
 * @param {string} timeZone
 */
export const toLocalInput = (iso, timeZone) => {
	if (!iso) return ''
	const date = new Date(iso)
	return new Date(date.getTime() + timeZoneOffset(date, timeZone)).toISOString().slice(0, 16)
}

/** A date (YYYY-MM-DD) in a time zone, default today. */
export const todayIn = (/** @type {string} */ timeZone, date = new Date()) =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date)

/** Add days to a YYYY-MM-DD date. */
export const addDays = (/** @type {string} */ ymd, /** @type {number} */ days) => {
	const date = new Date(`${ymd}T12:00:00Z`)
	date.setUTCDate(date.getUTCDate() + days)
	return date.toISOString().slice(0, 10)
}

/** Start and end (UTC ISO) of a local day. */
export const dayRange = (/** @type {string} */ ymd, /** @type {string} */ timeZone) => ({
	start: /** @type {string} */ (toUtcIso(ymd, timeZone)),
	end: /** @type {string} */ (toUtcIso(addDays(ymd, 1), timeZone))
})

/** Monday (YYYY-MM-DD) of the week that contains a date. */
export const mondayOf = (/** @type {string} */ ymd) => {
	const dayIndex = (new Date(`${ymd}T12:00:00Z`).getUTCDay() + 6) % 7 // 0 = Monday
	return addDays(ymd, -dayIndex)
}

/** A YYYY-MM-DD from a URL parameter, or the fallback when it's missing or invalid. */
export const dateParam = (/** @type {string | null} */ value, /** @type {string} */ fallback) =>
	value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback

/** Readable date + time. Without a time zone, the browser's own is used. */
export const formatDateTime = (
	/** @type {string | null | undefined} */ iso,
	/** @type {string | undefined} */ timeZone = undefined
) =>
	iso
		? new Intl.DateTimeFormat('en-GB', {
				timeZone,
				weekday: 'short',
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			}).format(new Date(iso))
		: ''

/** Only the time (14:30). */
export const formatTime = (
	/** @type {string | null | undefined} */ iso,
	/** @type {string | undefined} */ timeZone = undefined
) =>
	iso
		? new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(
				new Date(iso)
			)
		: ''

/** A YYYY-MM-DD as "Monday 25 Nov". */
export const formatDay = (/** @type {string} */ ymd) =>
	new Intl.DateTimeFormat('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC'
	}).format(new Date(`${ymd}T12:00:00Z`))

/** Hours between two moments (end = now when empty), rounded to 2 decimals. */
export const hoursBetween = (
	/** @type {string} */ startIso,
	/** @type {string | null | undefined} */ endIso
) => {
	const end = endIso ? new Date(endIso).getTime() : Date.now()
	return Math.round(((end - new Date(startIso).getTime()) / 3_600_000) * 100) / 100
}

/** Total hours of a list of time entries. */
export const totalHours = (
	/** @type {{ started_at: string, ended_at: string | null }[]} */ entries
) =>
	Math.round(
		entries.reduce(
			(total, { started_at, ended_at }) => total + hoursBetween(started_at, ended_at),
			0
		) * 100
	) / 100

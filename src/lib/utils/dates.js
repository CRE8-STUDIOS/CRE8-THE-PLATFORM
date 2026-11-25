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
 * @param {string | null} local
 * @param {string} timeZone
 */
export const toUtcIso = (local, timeZone) => {
	if (!local) return null
	const withTime = local.length === 10 ? `${local}T00:00` : local
	const guess = new Date(`${withTime}:00Z`)
	const firstTry = new Date(guess.getTime() - timeZoneOffset(guess, timeZone))
	return new Date(guess.getTime() - timeZoneOffset(firstTry, timeZone)).toISOString()
}

/**
 * @param {string | null | undefined} iso
 * @param {string} timeZone
 */
export const toLocalInput = (iso, timeZone) => {
	if (!iso) return ''
	const date = new Date(iso)
	return new Date(date.getTime() + timeZoneOffset(date, timeZone)).toISOString().slice(0, 16)
}

export const todayIn = (/** @type {string} */ timeZone, date = new Date()) =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date)

export const addDays = (/** @type {string} */ ymd, /** @type {number} */ days) => {
	const date = new Date(`${ymd}T12:00:00Z`)
	date.setUTCDate(date.getUTCDate() + days)
	return date.toISOString().slice(0, 10)
}

export const dayRange = (/** @type {string} */ ymd, /** @type {string} */ timeZone) => ({
	start: /** @type {string} */ (toUtcIso(ymd, timeZone)),
	end: /** @type {string} */ (toUtcIso(addDays(ymd, 1), timeZone))
})

export const mondayOf = (/** @type {string} */ ymd) => {
	const dayIndex = (new Date(`${ymd}T12:00:00Z`).getUTCDay() + 6) % 7
	return addDays(ymd, -dayIndex)
}

export const dateParam = (/** @type {string | null} */ value, /** @type {string} */ fallback) =>
	value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback

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

export const formatTime = (
	/** @type {string | null | undefined} */ iso,
	/** @type {string | undefined} */ timeZone = undefined
) =>
	iso
		? new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(
				new Date(iso)
			)
		: ''

export const formatDay = (/** @type {string} */ ymd) =>
	new Intl.DateTimeFormat('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC'
	}).format(new Date(`${ymd}T12:00:00Z`))

export const hoursBetween = (
	/** @type {string} */ startIso,
	/** @type {string | null | undefined} */ endIso
) => {
	const end = endIso ? new Date(endIso).getTime() : Date.now()
	return Math.round(((end - new Date(startIso).getTime()) / 3_600_000) * 100) / 100
}

export const totalHours = (
	/** @type {{ started_at: string, ended_at: string | null }[]} */ entries
) =>
	Math.round(
		entries.reduce(
			(total, { started_at, ended_at }) => total + hoursBetween(started_at, ended_at),
			0
		) * 100
	) / 100

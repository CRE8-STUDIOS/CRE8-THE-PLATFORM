import { formatTime } from './dates.js'

/**
 * @typedef {{ title: string, starts_at: string | null, all_day: boolean, client?: string | null }} PlannedItem
 * @typedef {{ meetings: PlannedItem[], projects: string[], taskCount: number, deadlines: string[], errands: PlannedItem[] }} PlanningData
 */

const list = (/** @type {string[]} */ items) =>
	new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }).format(items)

const when = (/** @type {PlannedItem} */ item, /** @type {string | undefined} */ timeZone) => {
	if (item.all_day) return 'all day'
	return item.starts_at ? `at ${formatTime(item.starts_at, timeZone)}` : ''
}

const describe = (/** @type {PlannedItem} */ item, /** @type {string | undefined} */ timeZone) =>
	[item.title, when(item, timeZone), item.client ? `with ${item.client}` : '']
		.filter(Boolean)
		.join(' ')

/** @param {PlanningData} data @param {string} [timeZone] */
export const buildPlanningSummary = (data, timeZone) => {
	const { meetings, projects, taskCount, deadlines, errands } = data
	const sentences = []

	if (meetings.length) {
		const label = meetings.length === 1 ? 'a meeting' : `${meetings.length} meetings`
		sentences.push(
			`You have ${label}: ${list(meetings.map((meeting) => describe(meeting, timeZone)))}.`
		)
	}

	if (projects.length) sentences.push(`You are working on ${list(projects)}.`)

	if (taskCount === 1) sentences.push('There is 1 task that needs to be done today.')
	else if (taskCount > 1) sentences.push(`There are ${taskCount} tasks that need to be done today.`)

	if (deadlines.length) {
		sentences.push(
			`${deadlines.length === 1 ? 'Deadline' : 'Deadlines'} today: ${list(deadlines)}.`
		)
	}

	if (errands.length) {
		const label = errands.length === 1 ? 'Errand' : 'Errands'
		sentences.push(
			`${label}: ${list(errands.map((errand) => describe({ ...errand, client: null }, timeZone)))}.`
		)
	}

	return sentences.length
		? sentences.join(' ')
		: 'It is a calm day, there is nothing on the schedule today.'
}

import { describe, expect, it } from 'vitest'
import {
	cardProgress,
	clockSentence,
	clockText,
	currentItem,
	deadlineLine,
	freeAfter,
	leaveTime,
	nextStep,
	projectStage,
	upNext
} from './helpers.js'

const timeZone = 'Europe/Amsterdam'
/** @param {Partial<import('#lib/agenda/timeline.js').AgendaItem>} extra */
const item = (extra) =>
	/** @type {import('#lib/agenda/timeline.js').AgendaItem} */ ({
		id: extra.title ?? 'x',
		type: 'work',
		title: 'Work',
		starts_at: null,
		ends_at: null,
		...extra
	})

// Times in UTC; Amsterdam is one hour ahead in November
const moodboard = item({
	title: 'Moodboard',
	starts_at: '2026-11-27T08:00:00.000Z',
	ends_at: '2026-11-27T10:30:00.000Z'
})
const meeting = item({
	type: 'meeting',
	title: 'Meeting with Noor',
	starts_at: '2026-11-27T11:00:00.000Z',
	ends_at: '2026-11-27T12:00:00.000Z',
	travel_before_minutes: 30,
	travel_after_minutes: 30
})
const call = item({
	type: 'meeting',
	title: 'Call with printer',
	starts_at: '2026-11-27T15:00:00.000Z',
	ends_at: '2026-11-27T15:30:00.000Z',
	meeting_url: 'https://meet.example'
})
const day = [call, meeting, moodboard]

describe('right now', () => {
	it('picks what happens now, else the clocked project, else the next item', () => {
		expect(currentItem(day, '2026-11-27T09:00:00.000Z', null)).toMatchObject({
			kind: 'now',
			item: { title: 'Moodboard' }
		})
		expect(currentItem(day, '2026-11-27T10:40:00.000Z', { project_id: 'p1' })).toEqual({
			kind: 'clock',
			projectId: 'p1'
		})
		expect(currentItem(day, '2026-11-27T10:40:00.000Z', null)).toMatchObject({
			kind: 'next',
			item: { title: 'Meeting with Noor' }
		})
		expect(currentItem(day, '2026-11-27T20:00:00.000Z', null)).toBeNull()
	})
})

describe('up next', () => {
	it('knows when to leave and how much time is free after', () => {
		expect(leaveTime(meeting)).toBe('2026-11-27T10:30:00.000Z')
		expect(freeAfter(meeting, day)).toBe(150)
		expect(freeAfter(call, day)).toBeNull()
	})

	it('writes the suggestions in plain sentences', () => {
		const [first, second] = upNext(day, '2026-11-27T10:40:00.000Z', timeZone)
		expect(first.title).toBe('Meeting with Noor at 12:00')
		expect(first.text).toBe(
			'Leave at 11:30, it is 30 min to get there. After that you have 2 h 30 free.'
		)
		expect(second.text).toBe(
			'It is online, the link is in your agenda. After that your day is free.'
		)
	})
})

describe('projects', () => {
	const cards = [
		{ id: '1', title: 'Brief', board_status: 'done', due_date: null },
		{ id: '2', title: 'Logo', board_status: 'todo', due_date: '2026-12-01' },
		{ id: '3', title: 'Moodboard v2', board_status: 'in_progress', due_date: '2026-12-04' }
	]

	it('finds the stage, the next step and the progress', () => {
		expect(projectStage(cards)).toBe('In progress')
		expect(
			projectStage([...cards, { id: '4', title: 'x', board_status: 'in_review', due_date: null }])
		).toBe('In review')
		expect(projectStage([])).toBe('To do')
		expect(nextStep(cards)?.title).toBe('Moodboard v2')
		expect(nextStep([cards[0]])).toBeNull()
		expect(cardProgress(cards)).toEqual({ done: 1, total: 3 })
	})

	it('describes how far a deadline is', () => {
		expect(
			deadlineLine({
				tasks: [
					{ status: 'done', estimated_minutes: 60 },
					{ status: 'open', estimated_minutes: 240 }
				],
				blocks: [],
				timeZone
			})
		).toBe('1 of 2 tasks done · 4 h left')
		expect(
			deadlineLine({
				tasks: [],
				blocks: [{ starts_at: '2026-12-02T09:00:00Z' }, { starts_at: '2026-12-03T09:00:00Z' }],
				timeZone
			})
		).toBe('planned Wed and Thu')
		expect(deadlineLine({ tasks: [], blocks: [], timeZone })).toBe('not planned yet')
	})
})

describe('clock', () => {
	it('shows the running time and says it in full', () => {
		expect(clockText(72)).toBe('1:12')
		expect(clockText(5)).toBe('0:05')
		expect(clockSentence(72, 'Summer campaign')).toBe(
			'Clocked in for 1 hour 12 minutes on Summer campaign'
		)
		expect(clockSentence(120, null)).toBe('Clocked in for 2 hours')
		expect(clockSentence(1, null)).toBe('Clocked in for 1 minute')
	})
})

import { describe, expect, it } from 'vitest'
import { cardStatus, deadlineText, minutesText, sortTasks, taskColumns, whenText } from './lists.js'

/** @param {Partial<import('./lists.js').Task>} extra */
const task = (extra) => ({
	id: extra.title ?? 't',
	title: 'Task',
	due_date: '2026-11-27',
	status: 'open',
	priority: null,
	estimated_minutes: null,
	...extra
})

describe('tasks', () => {
	it('sorts must, should, could, then no priority, then wont', () => {
		const sorted = sortTasks([
			task({ title: 'D', priority: 'wont' }),
			task({ title: 'C', priority: null }),
			task({ title: 'B', priority: 'should' }),
			task({ title: 'A', priority: 'must' })
		])
		expect(sorted.map((item) => item.title)).toEqual(['A', 'B', 'C', 'D'])
	})

	it('splits today, tomorrow, the week and tasks without a date', () => {
		const columns = taskColumns(
			[
				task({ title: 'Now' }),
				task({ title: 'Done', status: 'done' }),
				task({ title: 'Next', due_date: '2026-11-28' }),
				task({ title: 'Later', due_date: '2026-12-01' }),
				task({ title: 'Someday', due_date: null })
			],
			'2026-11-27'
		)
		expect(columns.today.open.map((item) => item.title)).toEqual(['Now'])
		expect(columns.today.done).toHaveLength(1)
		expect(columns.tomorrow.open).toHaveLength(1)
		expect(columns.week[0].date).toBe('2026-11-29')
		expect(columns.week.find((day) => day.date === '2026-12-01')?.open).toHaveLength(1)
		expect(columns.undated.map((item) => item.title)).toEqual(['Someday'])
	})
})

describe('texts', () => {
	it('writes durations, days and deadlines', () => {
		expect(minutesText(90)).toBe('1 h 30')
		expect(whenText('2026-11-27', '2026-11-27T11:00:00Z', '2026-11-27', 'Europe/Amsterdam')).toBe(
			'Today 12:00'
		)
		expect(whenText('2026-11-30', null, '2026-11-27', 'Europe/Amsterdam')).toBe('Mon 30 Nov')
		expect(deadlineText('2026-11-29', '2026-11-27')).toBe('In 2 days')
		expect(deadlineText('2027-01-31', '2026-11-27')).toBe('31 Jan')
	})

	it('writes the status line of a board card', () => {
		expect(
			cardStatus(
				{ board_status: 'in_review', client_review_status: 'waiting', due_date: null },
				'Noor'
			)
		).toBe('Waiting for Noor')
		expect(
			cardStatus({ board_status: 'todo', client_review_status: null, due_date: '2026-12-04' }, null)
		).toBe('Due 4 Dec')
	})
})

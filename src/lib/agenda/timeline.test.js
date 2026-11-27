import { describe, expect, it } from 'vitest'
import { buildTimeline, isFocus, plannedHours, subLine, typeLabel } from './timeline.js'
import { monthCells, weekLayout } from './grid.js'

const zone = 'Europe/Amsterdam'

/** @param {Partial<import('./timeline.js').AgendaItem>} extra */
const item = (extra) => ({
	id: extra.title ?? 'item',
	type: 'work',
	title: 'Item',
	starts_at: null,
	ends_at: null,
	...extra
})

describe('buildTimeline', () => {
	it('adds travel blocks and free time between items', () => {
		const rows = buildTimeline([
			item({ title: 'Focus', starts_at: '2026-11-27T08:00:00Z', ends_at: '2026-11-27T10:30:00Z' }),
			item({
				title: 'Meeting',
				type: 'meeting',
				starts_at: '2026-11-27T11:00:00Z',
				ends_at: '2026-11-27T12:00:00Z',
				travel_before_minutes: 30,
				travel_after_minutes: 15
			}),
			item({ title: 'Edit', starts_at: '2026-11-27T13:00:00Z', ends_at: '2026-11-27T14:00:00Z' })
		])
		expect(rows.map((row) => row.kind)).toEqual([
			'item',
			'travel',
			'item',
			'travel',
			'free',
			'item'
		])
		expect(rows[4]).toMatchObject({ kind: 'free', minutes: 45 })
	})

	it('skips short gaps and all day items', () => {
		const rows = buildTimeline([
			item({ starts_at: '2026-11-27T08:00:00Z', ends_at: '2026-11-27T09:00:00Z' }),
			item({ starts_at: '2026-11-27T09:10:00Z', ends_at: '2026-11-27T10:00:00Z' }),
			item({ starts_at: '2026-11-27T00:00:00Z', all_day: true })
		])
		expect(rows.map((row) => row.kind)).toEqual(['item', 'item'])
	})
})

describe('labels', () => {
	it('marks protected or creative work as focus', () => {
		expect(isFocus(item({ is_protected: true }))).toBe(true)
		expect(isFocus(item({ energy: 'creative' }))).toBe(true)
		expect(typeLabel(item({ type: 'errand' }))).toBe('Errand')
		expect(typeLabel(item({ is_protected: true }))).toBe('Focus')
	})

	it('picks one sub line per type', () => {
		const focus = item({ ends_at: '2026-11-27T10:30:00Z', is_protected: true })
		expect(subLine(focus, zone)).toBe('until 11:30 · protected')
		expect(subLine(item({ type: 'errand', closes_at: '17:00:00' }), zone)).toBe('open until 17:00')
		expect(subLine(item({ type: 'rest' }), zone)).toBe('')
	})
})

describe('plannedHours', () => {
	it('counts work, meetings, shoots, errands and tasks', () => {
		expect(
			plannedHours([
				item({ starts_at: '2026-11-27T08:00:00Z', ends_at: '2026-11-27T10:30:00Z' }),
				item({ type: 'rest', starts_at: '2026-11-27T11:00:00Z', ends_at: '2026-11-27T12:00:00Z' }),
				item({
					type: 'meeting',
					starts_at: '2026-11-27T13:00:00Z',
					ends_at: '2026-11-27T14:00:00Z'
				})
			])
		).toBe(3.5)
	})
})

describe('weekLayout', () => {
	it('places items in half hour rows from 08:00', () => {
		const { days, hours } = weekLayout(
			[item({ starts_at: '2026-11-24T09:00:00Z', ends_at: '2026-11-24T11:00:00Z' })],
			'2026-11-23',
			zone
		)
		expect(hours[0].label).toBe('08:00')
		expect(days[1].placed[0]).toMatchObject({ row: 5, span: 4 })
		expect(days[5].weekend).toBe(true)
	})

	it('grows to fit an early item', () => {
		const { hours } = weekLayout(
			[item({ starts_at: '2026-11-24T05:00:00Z', ends_at: '2026-11-24T06:00:00Z' })],
			'2026-11-23',
			zone
		)
		expect(hours[0].label).toBe('06:00')
	})
})

describe('monthCells', () => {
	it('builds six weeks from the Monday before the first', () => {
		const cells = monthCells('2026-11', [], '2026-11-27', zone)
		expect(cells).toHaveLength(42)
		expect(cells[0].date).toBe('2026-10-26')
		expect(cells.find((cell) => cell.today)?.date).toBe('2026-11-27')
	})

	it('puts deadlines first and counts the rest', () => {
		const items = ['A', 'B', 'C'].map((title) => item({ title, starts_at: '2026-11-10T09:00:00Z' }))
		items.push(item({ title: 'Logo', type: 'deadline', due_date: '2026-11-10' }))
		const cell = monthCells('2026-11', items, '2026-11-27', zone).find(
			(entry) => entry.date === '2026-11-10'
		)
		expect(cell?.items[0].title).toBe('Logo')
		expect(cell?.more).toBe(2)
	})
})

describe('labels', () => {
	it('formats titles for day, week and month', async () => {
		const { dayTitle, weekTitle, monthTitle, shiftMonth, monthParam } = await import('./labels.js')
		expect(dayTitle('2026-11-27')).toBe('Friday 27 Nov')
		expect(weekTitle('2026-11-23')).toBe('23 to 29 Nov')
		expect(weekTitle('2026-11-30')).toBe('30 Nov to 6 Dec')
		expect(monthTitle('2026-11', '2026-11-27')).toBe('November')
		expect(monthTitle('2027-01', '2026-11-27')).toBe('January 2027')
		expect(shiftMonth('2026-12', 1)).toBe('2027-01')
		expect(monthParam('2026-13', '2026-11')).toBe('2026-11')
	})
})

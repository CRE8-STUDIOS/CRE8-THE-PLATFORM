import { describe, expect, it } from 'vitest'
import { expandItem, parseRule } from './recurrence.js'

const zone = 'Europe/Amsterdam'
const item = (/** @type {Partial<Record<string, string | null>>} */ extra = {}) => ({
	starts_at: '2026-11-02T08:00:00.000Z',
	ends_at: '2026-11-02T09:30:00.000Z',
	recurrence_rule: null,
	recurrence_until: null,
	...extra
})

describe('parseRule', () => {
	it('reads frequency, interval, days, count and until', () => {
		expect(parseRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;COUNT=4;UNTIL=20261231')).toEqual({
			freq: 'WEEKLY',
			interval: 2,
			byDay: [0, 2],
			count: 4,
			until: '2026-12-31'
		})
	})

	it('ignores empty and unsupported rules', () => {
		expect(parseRule('')).toBeNull()
		expect(parseRule('FREQ=YEARLY')).toBeNull()
	})
})

describe('expandItem', () => {
	it('returns a single item when it starts in the range', () => {
		expect(expandItem(item(), '2026-11-02', '2026-11-03', zone)).toHaveLength(1)
		expect(expandItem(item(), '2026-11-03', '2026-11-04', zone)).toHaveLength(0)
	})

	it('repeats daily inside the range only', () => {
		const days = expandItem(
			item({ recurrence_rule: 'FREQ=DAILY' }),
			'2026-11-05',
			'2026-11-08',
			zone
		)
		expect(days.map((day) => day.occurrence)).toEqual(['2026-11-05', '2026-11-06', '2026-11-07'])
	})

	it('repeats weekly on the chosen days and keeps the length', () => {
		const days = expandItem(
			item({ recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO,TH' }),
			'2026-11-09',
			'2026-11-16',
			zone
		)
		expect(days.map((day) => day.occurrence)).toEqual(['2026-11-09', '2026-11-12'])
		expect(days[1].ends_at).toBe('2026-11-12T09:30:00.000Z')
	})

	it('keeps the wall clock time across daylight saving', () => {
		const [march] = expandItem(
			item({ recurrence_rule: 'FREQ=MONTHLY' }),
			'2027-04-01',
			'2027-04-30',
			zone
		)
		expect(march.starts_at).toBe('2027-04-02T07:00:00.000Z')
	})

	it('stops at COUNT, counting occurrences before the range', () => {
		const rule = { recurrence_rule: 'FREQ=DAILY;COUNT=5' }
		expect(expandItem(item(rule), '2026-11-04', '2026-11-30', zone)).toHaveLength(3)
	})

	it('stops at recurrence_until', () => {
		const days = expandItem(
			item({ recurrence_rule: 'FREQ=DAILY', recurrence_until: '2026-11-04' }),
			'2026-11-01',
			'2026-11-30',
			zone
		)
		expect(days.at(-1)?.occurrence).toBe('2026-11-04')
	})

	it('skips months that are too short', () => {
		const days = expandItem(
			item({
				starts_at: '2027-01-31T09:00:00.000Z',
				ends_at: null,
				recurrence_rule: 'FREQ=MONTHLY'
			}),
			'2027-01-01',
			'2027-05-01',
			zone
		)
		expect(days.map((day) => day.occurrence)).toEqual(['2027-01-31', '2027-03-31'])
	})
})

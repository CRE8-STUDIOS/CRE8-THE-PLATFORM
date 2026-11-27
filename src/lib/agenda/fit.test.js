import { describe, expect, it } from 'vitest'
import { answersToItem, fridayFrom, readExtras } from './answers.js'
import { amount, busyOn, describeAdd, findErrandSlot, freeMinutes } from './fit.js'

const timeZone = 'Europe/Amsterdam'
const today = '2026-11-27'
const context = (/** @type {Partial<import('./fit.js').FitContext>} */ extra = {}) => ({
	today,
	now: '2026-11-27T08:00:00.000Z',
	timeZone,
	items: [],
	workingHours: [{ weekday: 5, starts_at: '09:00', ends_at: '17:00' }],
	...extra
})
/** @param {Partial<import('./timeline.js').AgendaItem>} extra */
const item = (extra) => ({
	id: 'x',
	type: 'work',
	title: 'Edit lookbook',
	starts_at: null,
	ends_at: null,
	...extra
})

describe('answersToItem', () => {
	it('maps a task to a due date, priority and minutes', () => {
		const { values, errors } = answersToItem(
			'task',
			{ title: 'Send contract', day: 'tomorrow', priority: 'must', duration: '30' },
			{ today, timeZone }
		)
		expect(errors).toEqual({})
		expect(values).toMatchObject({
			due_date: '2026-11-28',
			priority: 'must',
			estimated_minutes: 30,
			starts_at: null
		})
	})

	it('leaves both dates empty for no date', () => {
		const { values } = answersToItem('task', { title: 'Later', day: 'none' }, { today, timeZone })
		expect(values.due_date).toBeNull()
	})

	it('needs a title, a valid other duration and an end after the start', () => {
		expect(
			answersToItem('task', { title: ' ', duration: 'other', minutes: 'x' }, { today, timeZone })
				.errors
		).toMatchObject({
			title: 'Give it a title.',
			duration: 'Fill in the minutes.'
		})
		expect(
			answersToItem(
				'meeting',
				{ title: 'Brief', day: 'today', from: '13:00', to: '12:00' },
				{ today, timeZone }
			).errors.to
		).toBe('The end has to be after the start.')
	})

	it('maps meeting travel to both sides and keeps the wall clock time', () => {
		const { values } = answersToItem(
			'meeting',
			{
				title: 'Brief',
				day: 'today',
				from: '12:00',
				to: '13:00',
				where: 'in_person',
				travel: '30',
				address: 'NDSM 12'
			},
			{ today, timeZone }
		)
		expect(values).toMatchObject({
			starts_at: '2026-11-27T11:00:00.000Z',
			travel_before_minutes: 30,
			travel_after_minutes: 30,
			address: 'NDSM 12'
		})
	})

	it('checks opening hours and maps heads up to a reminder', () => {
		expect(
			answersToItem(
				'errand',
				{ title: 'Prints', opens: '17:00', closes: '09:00' },
				{ today, timeZone }
			).errors.closes
		).toBe('It has to close after it opens.')
		const { values } = answersToItem(
			'deadline',
			{ title: 'Lookbook', due: 'next_friday', heads_up: '1' },
			{ today, timeZone }
		)
		expect(values).toMatchObject({ due_date: '2026-12-04', reminder_minutes: [1440] })
	})

	it('names rest after its kind and makes a day off all day', () => {
		const { values } = answersToItem(
			'rest',
			{ kind: 'day_off', day: 'tomorrow', lock: 'on' },
			{ today, timeZone }
		)
		expect(values).toMatchObject({ title: 'Day off', all_day: true, is_protected: true })
	})

	it('finds this and next friday', () => {
		expect(fridayFrom('2026-11-27', 0)).toBe('2026-11-27')
		expect(fridayFrom('2026-11-28', 0)).toBe('2026-12-04')
	})

	it('reads checklist lines and people', () => {
		const form = new FormData()
		form.set('checklist', 'Camera\n\nLens ')
		form.append('person_name', 'Noor')
		form.append('person_role', 'Client')
		form.append('person_name', '')
		const extras = readExtras(form)
		expect(extras.checklist).toEqual(['Camera', 'Lens'])
		expect(extras.people).toEqual([{ name: 'Noor', role: 'Client', email: null, phone: null }])
	})
})

describe('fit', () => {
	const lookbook = item({ starts_at: '2026-11-27T15:00:00Z', ends_at: '2026-11-27T17:00:00Z' })
	const meeting = item({
		title: 'Noor',
		starts_at: '2026-11-27T11:00:00Z',
		ends_at: '2026-11-27T12:00:00Z',
		travel_before_minutes: 30,
		travel_after_minutes: 15
	})

	it('counts travel as busy time', () => {
		expect(busyOn([meeting], today, timeZone)).toEqual([{ start: 690, end: 795, title: 'Noor' }])
	})

	it('counts free minutes from now inside working hours', () => {
		expect(freeMinutes(today, context({ items: [lookbook] }))).toBe(7 * 60)
		expect(amount(210)).toBe('3 h 30')
	})

	it('describes a task with the free time left', () => {
		expect(
			describeAdd('task', { title: 'A', day: 'today', priority: 'must', duration: '30' }, context())
		).toBe('A task for today, must have, 30 min. You still have 8 h free today.')
	})

	it('reports an overlap with travel included', () => {
		const sentence = describeAdd(
			'meeting',
			{ title: 'B', day: 'today', from: '13:00', to: '14:00', where: 'in_person', travel: '15' },
			context({ items: [meeting] })
		)
		expect(sentence).toBe('This overlaps with Noor 11:30 to 13:15.')
	})

	it('finds the first errand moment while the place is open', () => {
		const slot = findErrandSlot(
			{ opens: '12:00', closes: '17:00', minutes: 45 },
			context({ items: [meeting, lookbook] })
		)
		expect(slot).toEqual({ day: today, from: '13:15', to: '14:00' })
	})

	it('says when a picked errand time is outside opening hours', () => {
		expect(
			describeAdd(
				'errand',
				{
					location: 'Fotolab',
					opens: '09:00',
					closes: '17:00',
					duration: '45',
					timing: 'pick',
					day: 'today',
					from: '16:30'
				},
				context()
			)
		).toBe('Fotolab is closed then. It is open 09:00 to 17:00.')
	})
})

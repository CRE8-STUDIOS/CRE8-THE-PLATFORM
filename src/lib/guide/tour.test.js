import { describe, expect, it } from 'vitest'
import { findChapter, tourStep } from './tour.js'

describe('tour', () => {
	const agenda = /** @type {import('./tour.js').Chapter} */ (findChapter('agenda'))

	it('links back and forward within a chapter and on the real page', () => {
		const first = tourStep(agenda, 0)
		expect(first.back).toBe('/guide/app/morning?step=2')
		expect(first.inApp).toEqual({
			here: '/agenda?tour=agenda&step=0',
			back: null,
			next: '/agenda?tour=agenda&step=1'
		})
	})

	it('goes on to the next chapter after the last step', () => {
		const last = tourStep(agenda, agenda.steps.length - 1)
		expect(last.last).toBe(true)
		expect(last.nextChapter?.slug).toBe('tasks')
		expect(last.inApp?.next).toBe('/agenda/tasks?tour=tasks&step=0')
	})

	it('does not show the morning in the app, from the agenda on it does', () => {
		const morning = /** @type {import('./tour.js').Chapter} */ (findChapter('morning'))
		expect(tourStep(morning, 0).inApp).toBeNull()
		expect(tourStep(agenda, 0).inApp).not.toBeNull()
	})

	it('starts at the top for a step that does not exist', () => {
		expect(tourStep(agenda, 40).step).toBe(0)
		expect(findChapter('nope')).toBeNull()
	})
})

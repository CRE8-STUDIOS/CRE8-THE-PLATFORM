import { describe, expect, it } from 'vitest'
import { answer, clampStep, isLastStep, transcript } from './lesson.js'
import { moneyLessons } from './content.js'

const btw = /** @type {import('./lesson.js').Lesson} */ (
	moneyLessons.find((lesson) => lesson.slug === 'what-is-btw')
)
const types = /** @type {import('./lesson.js').Lesson} */ (
	moneyLessons.find((lesson) => lesson.slug === 'business-types')
)

describe('lesson', () => {
	it('stays on a wrong quiz answer and moves on with a right one', () => {
		expect(answer(btw, 2, 0)).toMatchObject({ stay: true, next: 2 })
		expect(answer(btw, 2, 0)?.feedback).toContain('Try again')
		expect(answer(btw, 2, 1)).toMatchObject({ stay: false, next: 3, feedback: null })
		expect(answer(btw, 2, 9)).toBeNull()
	})

	it('passes on the business type action', () => {
		expect(answer(types, 6, 1)).toMatchObject({ next: 7, businessType: 'bv' })
	})

	it('knows the last step and keeps saved steps in range', () => {
		expect(isLastStep(btw, btw.steps.length - 1)).toBe(true)
		expect(isLastStep(btw, 0)).toBe(false)
		expect(clampStep(btw, 99)).toBe(0)
		expect(clampStep(btw, 3)).toBe(3)
	})

	it('shows the conversation so far, without guessing between answers', () => {
		const lines = transcript(btw, 3)
		expect(lines).toHaveLength(3)
		expect(lines[0].me).toBeNull()
		expect(lines[1].me).toBe('Got it')
		expect(lines[2].me).toBe('605 euro')
	})
})

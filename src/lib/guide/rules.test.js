import { describe, expect, it, vi } from 'vitest'
import { fillAll, fillRules, formatRule } from './rules.js'
import { moneyLessons } from './content.js'

const rules = { kvk_registration_fee: 85.15, kor_turnover_limit: 20000, vpb_rate_high: 25.8 }

describe('tax rules', () => {
	it('formats numbers the Dutch way', () => {
		expect(formatRule(85.15)).toBe('85,15')
		expect(formatRule(20000)).toBe('20.000')
		expect(formatRule(1225)).toBe('1.225')
		expect(formatRule(25.8)).toBe('25,8')
	})

	it('fills known keys and reports missing ones', () => {
		const onMissing = vi.fn()
		expect(fillRules('It costs {kvk_registration_fee} euro.', rules, onMissing)).toBe(
			'It costs 85,15 euro.'
		)
		expect(fillRules('Up to {vpb_bracket} euro.', rules, onMissing)).toBe('Up to ? euro.')
		expect(onMissing).toHaveBeenCalledWith('vpb_bracket')
		expect(fillRules('No numbers here.', rules)).toBe('No numbers here.')
	})

	it('fills a whole lesson and keeps its shape', () => {
		const lesson = fillAll(moneyLessons[1], rules)
		expect(lesson.steps[1].bot[1]).toContain('85,15 euro')
		expect(lesson.steps[1].options[0].next).toBe(2)
	})
})

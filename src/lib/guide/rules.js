/** @typedef {Record<string, number>} Rules */

const number = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 2 })

/** A rule value the Dutch way: 85,15 and 20.000 */
export const formatRule = (/** @type {number} */ value) => number.format(value)

/**
 * Replaces {key} with the value from the tax rules. A missing key is
 * reported and shown as a question mark, so the text still reads.
 * @param {string} text
 * @param {Rules} rules
 * @param {(key: string) => void} [onMissing]
 */
export const fillRules = (text, rules, onMissing) =>
	text.replace(/\{([a-z_]+)\}/g, (_, /** @type {string} */ key) => {
		if (key in rules) return formatRule(rules[key])
		onMissing?.(key)
		return '?'
	})

/**
 * Fills every string inside a piece of guide content, keeping its shape.
 * @template T
 * @param {T} value
 * @param {Rules} rules
 * @param {(key: string) => void} [onMissing]
 * @returns {T}
 */
export const fillAll = (value, rules, onMissing) => {
	if (typeof value === 'string') return /** @type {T} */ (fillRules(value, rules, onMissing))
	if (Array.isArray(value))
		return /** @type {T} */ (value.map((item) => fillAll(item, rules, onMissing)))
	if (value && typeof value === 'object')
		return /** @type {T} */ (
			Object.fromEntries(
				Object.entries(value).map(([key, item]) => [key, fillAll(item, rules, onMissing)])
			)
		)
	return value
}

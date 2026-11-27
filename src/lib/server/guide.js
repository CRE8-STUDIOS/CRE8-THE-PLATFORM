import { fillAll } from '#lib/guide/rules.js'

/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} Supabase
 */

/**
 * The tax rules for this year. A key that is not set for this year yet
 * falls back to the latest year that has it.
 * @param {Supabase} supabase
 * @param {number} [year]
 */
export const loadRules = async (supabase, year = new Date().getFullYear()) => {
	const { data } = await supabase
		.from('tax_rules')
		.select('year, key, value')
		.lte('year', year)
		.order('year', { ascending: false })
	/** @type {import('#lib/guide/rules.js').Rules} */
	const rules = {}
	for (const row of data ?? []) if (!(row.key in rules)) rules[row.key] = Number(row.value)
	return { rules, year: data?.[0]?.year ?? year }
}

/**
 * Fills guide content with the rules and logs keys that are missing.
 * @template T
 * @param {T} content
 * @param {import('#lib/guide/rules.js').Rules} rules
 * @returns {T}
 */
export const withRules = (content, rules) => {
	const missing = new Set()
	const filled = fillAll(content, rules, (key) => missing.add(key))
	if (missing.size) console.warn(`Guide: no tax rule for ${[...missing].join(', ')}`)
	return filled
}

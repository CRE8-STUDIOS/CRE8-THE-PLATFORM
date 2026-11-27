import { fillAll } from '#lib/guide/rules.js'
import { appTour, moneyLessons } from '#lib/guide/content.js'
import { words } from '#lib/guide/words.js'
import { wordId } from '#lib/guide/progress.js'

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

/**
 * The saved progress of one track.
 * @param {Supabase} supabase
 * @param {'app' | 'money'} track
 */
export const loadProgress = async (supabase, track) => {
	const { data } = await supabase
		.from('guide_progress')
		.select('item_slug, step, completed_at')
		.eq('track', track)
	return data ?? []
}

/**
 * Saves the step someone is on, and optionally that the item is done.
 * @param {Supabase} supabase
 * @param {{ track: 'app' | 'money', slug: string, step: number, completed?: boolean }} input
 */
export const saveProgress = async (supabase, { track, slug, step, completed = false }) => {
	const { error } = await supabase.from('guide_progress').upsert(
		{
			track,
			item_slug: slug,
			step,
			...(completed ? { completed_at: new Date().toISOString() } : {})
		},
		{ onConflict: 'user_id,track,item_slug' }
	)
	if (error) console.error('Guide: progress not saved', error.message)
	return error
}

/**
 * Everything the guide search looks through: lessons, tour chapters and words.
 * @param {import('#lib/guide/rules.js').Rules} rules
 * @returns {import('#lib/guide/progress.js').SearchEntry[]}
 */
export const searchIndex = (rules) =>
	withRules(
		[
			...moneyLessons.map((lesson) => ({
				kind: /** @type {const} */ ('lesson'),
				title: lesson.title,
				text: lesson.summary,
				href: `/guide/money/${lesson.slug}`
			})),
			...appTour.map((chapter) => ({
				kind: /** @type {const} */ ('tour'),
				title: chapter.title,
				text: chapter.steps.map((step) => step.text).join(' '),
				href: `/guide/app/${chapter.slug}`
			})),
			...words.map((entry) => ({
				kind: /** @type {const} */ ('word'),
				title: entry.word,
				text: entry.meaning,
				href: `/guide/words#${wordId(entry.word)}`
			}))
		],
		rules
	)

/**
 * Saves what kind of business someone is.
 * @param {Supabase} supabase
 * @param {string} userId
 * @param {import('#lib/guide/compare.js').BusinessType} type
 */
export const saveBusinessType = async (supabase, userId, type) => {
	const { error } = await supabase.from('profiles').update({ business_type: type }).eq('id', userId)
	if (error) console.error('Guide: business type not saved', error.message)
	return error
}

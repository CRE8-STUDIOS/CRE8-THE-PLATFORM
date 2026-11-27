/**
 * @typedef {{ item_slug: string, step: number, completed_at: string | null }} ProgressRow
 * @typedef {'done' | 'current' | 'todo'} ItemState
 */

/**
 * Where someone is in a track: how many items are done, which one is next,
 * and the state and saved step of every item.
 * @template {{ slug: string }} T
 * @param {T[]} items
 * @param {ProgressRow[]} rows
 */
export const trackProgress = (items, rows) => {
	const bySlug = new Map(rows.map((row) => [row.item_slug, row]))
	const next = items.find((item) => !bySlug.get(item.slug)?.completed_at) ?? null
	return {
		total: items.length,
		done: items.filter((item) => bySlug.get(item.slug)?.completed_at).length,
		next,
		items: items.map((item, index) => {
			const row = bySlug.get(item.slug)
			/** @type {ItemState} */
			const state = row?.completed_at ? 'done' : item === next ? 'current' : 'todo'
			return { ...item, number: index + 1, state, step: row?.step ?? 0 }
		})
	}
}

/**
 * @typedef {{ kind: 'lesson' | 'tour' | 'word', title: string, text: string, href: string }} SearchEntry
 */

/** Lowercase without accents, to match "Btw" with "btw" and "café" with "cafe" */
const plain = (/** @type {string} */ text) =>
	text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * The entries whose title or text contain every word of the query.
 * @param {SearchEntry[]} entries
 * @param {string} query
 */
export const searchGuide = (entries, query) => {
	const terms = plain(query).split(/\s+/).filter(Boolean)
	if (!terms.length) return []
	return entries.filter((entry) => {
		const haystack = plain(`${entry.title} ${entry.text}`)
		return terms.every((term) => haystack.includes(term))
	})
}

/** The anchor of a word in the words list */
export const wordId = (/** @type {string} */ word) =>
	`word-${plain(word).replace(/[^a-z0-9]+/g, '-')}`

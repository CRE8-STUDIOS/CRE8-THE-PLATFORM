import { words } from '#lib/guide/words.js'
import { wordId } from '#lib/guide/progress.js'
import { loadRules, withRules } from '#lib/server/guide.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { rules } = await loadRules(locals.supabase)
	return {
		words: withRules(words, rules).map((entry) => ({ ...entry, id: wordId(entry.word) })),
		query: url.searchParams.get('q') ?? ''
	}
}

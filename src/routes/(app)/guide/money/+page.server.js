import { moneyLessons } from '#lib/guide/content.js'
import { trackProgress } from '#lib/guide/progress.js'
import { loadProgress, loadRules, withRules } from '#lib/server/guide.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const [{ rules, year }, rows] = await Promise.all([
		loadRules(locals.supabase),
		loadProgress(locals.supabase, 'money')
	])
	const lessons = withRules(
		moneyLessons.map(({ slug, title, summary, minutes }) => ({ slug, title, summary, minutes })),
		rules
	)
	const progress = trackProgress(lessons, rows)
	return { progress, rules, year }
}

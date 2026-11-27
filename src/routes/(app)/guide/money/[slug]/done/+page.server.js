import { moneyLessons } from '#lib/guide/content.js'
import { trackProgress } from '#lib/guide/progress.js'
import { findLesson } from '#lib/server/lesson.js'
import { loadProgress, loadRules, withRules } from '#lib/server/guide.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { lesson, number, total } = findLesson(params.slug)
	const [{ rules }, rows] = await Promise.all([
		loadRules(locals.supabase),
		loadProgress(locals.supabase, 'money')
	])
	const progress = trackProgress(moneyLessons, rows)
	const following = moneyLessons[number] ?? null
	const next = following && {
		title: withRules(following.title, rules),
		href: `/guide/money/${following.slug}`
	}

	return {
		number,
		total,
		done: progress.done,
		finished: withRules(lesson.done, rules),
		// The button of the lesson can already be the next lesson
		next: next && next.href !== lesson.done.cta.href ? next : null
	}
}

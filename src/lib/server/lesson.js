import { error, redirect } from '@sveltejs/kit'
import { moneyLessons } from '#lib/guide/content.js'
import { isBusinessType } from '#lib/guide/compare.js'
import { answer, clampStep, isLastStep, transcript } from '#lib/guide/lesson.js'
import {
	loadProgress,
	loadRules,
	saveBusinessType,
	saveProgress,
	withRules
} from '#lib/server/guide.js'

/** The lesson with this slug and its place in the track, or a 404 */
export const findLesson = (/** @type {string} */ slug) => {
	const index = moneyLessons.findIndex((lesson) => lesson.slug === slug)
	if (index === -1) error(404, 'This lesson does not exist.')
	return {
		lesson: /** @type {import('#lib/guide/lesson.js').Lesson} */ (moneyLessons[index]),
		number: index + 1,
		total: moneyLessons.length
	}
}

/**
 * Everything the lesson chat shows: the conversation so far and the step
 * someone is on, continued from their saved progress.
 * @param {import('#lib/server/guide.js').Supabase} supabase
 * @param {string} slug
 */
export const loadLesson = async (supabase, slug) => {
	const { lesson: raw, number, total } = findLesson(slug)
	const [{ rules }, rows] = await Promise.all([
		loadRules(supabase),
		loadProgress(supabase, 'money')
	])
	const lesson = withRules(raw, rules)
	const saved = rows.find((row) => row.item_slug === slug)
	// A finished lesson starts again from the top
	const step = saved?.completed_at ? 0 : clampStep(lesson, saved?.step ?? 0)

	return {
		lesson: { slug, title: lesson.title, minutes: lesson.minutes, number, total },
		step,
		history: transcript(lesson, step),
		current: lesson.steps[step],
		last: isLastStep(lesson, step)
	}
}

/**
 * The answer and finish actions of a lesson chat. Every answer is a form
 * post, so the lesson also works without JavaScript.
 * @param {(params: Record<string, string>) => string} slugOf
 * @returns {import('@sveltejs/kit').Actions}
 */
export const lessonActions = (slugOf) => ({
	answer: async ({ request, locals, params, url }) => {
		if (!locals.user) error(401)
		const slug = slugOf(params)
		const { lesson } = findLesson(slug)
		const formData = await request.formData()
		const step = clampStep(lesson, Number(formData.get('step')))
		const result = answer(lesson, step, Number(formData.get('option')))
		if (!result) redirect(303, url.pathname)

		if (result.stay) {
			const { rules } = await loadRules(locals.supabase)
			return { step, label: result.label, feedback: withRules(result.feedback, rules) }
		}
		if (result.businessType && isBusinessType(result.businessType))
			await saveBusinessType(
				locals.supabase,
				locals.user.id,
				/** @type {import('#lib/guide/compare.js').BusinessType} */ (result.businessType)
			)
		await saveProgress(locals.supabase, { track: 'money', slug, step: result.next })
		redirect(303, url.pathname)
	},

	finish: async ({ locals, params }) => {
		const slug = slugOf(params)
		const { lesson } = findLesson(slug)
		await saveProgress(locals.supabase, {
			track: 'money',
			slug,
			step: lesson.steps.length - 1,
			completed: true
		})
		redirect(303, `/guide/money/${slug}/done`)
	}
})

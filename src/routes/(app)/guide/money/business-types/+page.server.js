import { error, fail, redirect } from '@sveltejs/kit'
import { moneyLessons } from '#lib/guide/content.js'
import { comparison, isBusinessType } from '#lib/guide/compare.js'
import { loadRules, saveBusinessType, saveProgress, withRules } from '#lib/server/guide.js'

const SLUG = 'business-types'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase, user } = locals
	const [{ rules, year }, { data: profile }] = await Promise.all([
		loadRules(supabase),
		supabase
			.from('profiles')
			.select('business_type')
			.eq('id', user?.id ?? '')
			.maybeSingle()
	])
	const index = moneyLessons.findIndex((lesson) => lesson.slug === SLUG)
	const lesson = moneyLessons[index]

	return {
		lesson: { title: lesson.title, minutes: lesson.minutes, number: index + 1 },
		total: moneyLessons.length,
		comparison: withRules(comparison, rules),
		year,
		businessType: profile?.business_type ?? null
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) error(401)
		const type = (await request.formData()).get('business_type')
		if (!isBusinessType(type)) return fail(400, { message: 'Choose what you are right now.' })

		const saved = await saveBusinessType(
			locals.supabase,
			locals.user.id,
			/** @type {import('#lib/guide/compare.js').BusinessType} */ (type)
		)
		if (saved) return fail(400, { message: 'This could not be saved. Try again.' })

		const lesson = moneyLessons.find((item) => item.slug === SLUG)
		await saveProgress(locals.supabase, {
			track: 'money',
			slug: SLUG,
			step: (lesson?.steps.length ?? 1) - 1,
			completed: true
		})
		redirect(303, `/guide/money/${SLUG}/done`)
	}
}

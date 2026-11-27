import { error, redirect } from '@sveltejs/kit'
import { appTour } from '#lib/guide/content.js'
import { trackProgress } from '#lib/guide/progress.js'
import { findChapter, tourStep } from '#lib/guide/tour.js'
import { loadProgress, loadRules, saveProgress, withRules } from '#lib/server/guide.js'

/** @param {string} slug */
const chapterOf = (slug) => {
	const chapter = findChapter(slug)
	if (!chapter) error(404, 'This part of the tour does not exist.')
	return chapter
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params, url }) => {
	const chapter = chapterOf(params.slug)
	const [{ rules }, rows] = await Promise.all([
		loadRules(locals.supabase),
		loadProgress(locals.supabase, 'app')
	])
	const saved = rows.find((row) => row.item_slug === chapter.slug)
	const asked = url.searchParams.get('step')
	const step = asked === null ? (saved?.completed_at ? 0 : (saved?.step ?? 0)) : Number(asked)
	const progress = trackProgress(appTour, rows)

	return {
		tour: withRules(tourStep(chapter, step), rules),
		chapters: progress.items.map(({ slug, title, number, state }) => ({
			slug,
			title,
			number,
			state
		})),
		done: progress.done
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	next: async ({ request, locals, params }) => {
		const chapter = chapterOf(params.slug)
		const { step, last, nextChapter } = tourStep(
			chapter,
			Number((await request.formData()).get('step'))
		)
		await saveProgress(locals.supabase, {
			track: 'app',
			slug: chapter.slug,
			step: last ? step : step + 1,
			completed: last
		})
		if (!last) redirect(303, `/guide/app/${chapter.slug}?step=${step + 1}`)
		redirect(303, nextChapter ? `/guide/app/${nextChapter.slug}?step=0` : '/guide')
	}
}

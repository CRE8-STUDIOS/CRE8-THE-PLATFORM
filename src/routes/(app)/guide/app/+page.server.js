import { redirect } from '@sveltejs/kit'
import { appTour } from '#lib/guide/content.js'
import { trackProgress } from '#lib/guide/progress.js'
import { loadProgress } from '#lib/server/guide.js'

/** The tour opens at the chapter someone is on */
/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const progress = trackProgress(appTour, await loadProgress(locals.supabase, 'app'))
	redirect(307, `/guide/app/${(progress.next ?? appTour[0]).slug}`)
}

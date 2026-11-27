import { findChapter, tourStep } from '#lib/guide/tour.js'
import { loadRules, withRules } from '#lib/server/guide.js'

/**
 * The tour step to show on this page, when the guide opened it with
 * ?tour=slug&step=n. Only those two params rerun this load.
 * @param {import('#lib/server/guide.js').Supabase} supabase
 * @param {URL} url
 */
const loadTour = async (supabase, url) => {
	const chapter = findChapter(url.searchParams.get('tour'))
	if (!chapter) return null
	const { rules } = await loadRules(supabase)
	return withRules(tourStep(chapter, Number(url.searchParams.get('step') ?? 0)), rules)
}

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, user } = locals
	const userId = user?.id ?? ''

	const [{ data: profile }, { data: clock }, tour] = await Promise.all([
		supabase
			.from('profiles')
			.select('id, name, business_name, is_admin, timezone, clock_in_mode, check_in_after_minutes')
			.eq('id', userId)
			.single(),
		supabase
			.from('time_entries')
			.select('id, started_at, category, project_id, projects(title)')
			.eq('user_id', userId)
			.is('ended_at', null)
			.maybeSingle(),
		loadTour(supabase, url)
	])

	return { profile, clock, tour }
}

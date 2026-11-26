import { redirect } from '@sveltejs/kit'
import { todayIn } from '#lib/utils/dates.js'
import { buildPlanningSummary } from '#lib/utils/planning.js'
import { loadPlanningData } from '#lib/server/planning.js'
import { setForToday, INTRO_SEEN } from '#lib/server/daily.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, parent, url, cookies }) => {
	const { supabase, timezone } = locals
	const { profile, clock } = await parent()
	if (clock) redirect(303, '/overview')

	const today = todayIn(timezone)
	setForToday(cookies, INTRO_SEEN, today)

	const hour = Number(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: timezone,
			hour: 'numeric',
			hourCycle: 'h23'
		}).format(new Date())
	)
	const partOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

	const step = url.searchParams.get('step') === 'planning' ? 'planning' : 'greeting'
	const summary =
		step === 'planning'
			? buildPlanningSummary(await loadPlanningData(supabase, today, timezone), timezone)
			: ''

	return {
		step,
		summary,
		partOfDay,
		firstName: profile?.name?.trim().split(/\s+/)[0] || null
	}
}

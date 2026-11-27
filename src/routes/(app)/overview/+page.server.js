import { redirect } from '@sveltejs/kit'
import { todayIn } from '#lib/utils/dates.js'
import { isSetToday, setForToday, CLOCK_IN_LATER } from '#lib/server/daily.js'
import { loadOverview } from '#lib/server/overview.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, cookies, url, parent }) => {
	const { clock } = await parent()
	const overview = await loadOverview(locals.supabase, {
		timeZone: locals.timezone,
		clock: clock && { started_at: clock.started_at, project_id: clock.project_id }
	})
	const today = overview.today

	return {
		...overview,
		dateLabel: new Intl.DateTimeFormat('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			timeZone: 'UTC'
		}).format(new Date(`${today}T12:00:00Z`)),
		clockInLater: isSetToday(cookies, CLOCK_IN_LATER, today),
		choosingProject: url.searchParams.get('clock') === 'choose',
		switchingProject: url.searchParams.get('clock') === 'switch',
		clockProjects: overview.projects.map(({ id, title, client }) => ({ id, title, client }))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	later: async ({ locals, cookies }) => {
		setForToday(cookies, CLOCK_IN_LATER, todayIn(locals.timezone))
		redirect(303, '/overview')
	}
}

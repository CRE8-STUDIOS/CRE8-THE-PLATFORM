import { redirect } from '@sveltejs/kit'
import { todayIn } from '#lib/utils/dates.js'
import { introSeenToday } from '#lib/server/intro.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, cookies }) => {
	const { role, timezone } = locals
	if (role === 'freelancer') {
		redirect(303, introSeenToday(cookies, todayIn(timezone)) ? '/overview' : '/welcome')
	}
	if (role === 'client') redirect(303, '/portal')
	redirect(303, '/login')
}

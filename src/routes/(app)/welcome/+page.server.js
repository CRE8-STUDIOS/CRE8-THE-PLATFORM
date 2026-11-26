import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, parent, url }) => {
	const { timezone } = locals
	const { profile, clock } = await parent()
	if (clock) redirect(303, '/overview')

	const hour = Number(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: timezone,
			hour: 'numeric',
			hourCycle: 'h23'
		}).format(new Date())
	)
	const partOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

	return {
		step: url.searchParams.get('step') === 'planning' ? 'planning' : 'greeting',
		summary: '',
		partOfDay,
		firstName: profile?.name?.trim().split(/\s+/)[0] || null
	}
}

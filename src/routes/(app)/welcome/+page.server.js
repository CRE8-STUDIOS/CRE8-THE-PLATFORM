/**
 * Welcome / clock-in screen: pick a project (or a non-project category) and start.
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ locals, parent }) => {
	const { supabase, timezone } = locals
	const [{ profile }, { data: projects }] = await Promise.all([
		parent(),
		supabase
			.from('projects')
			.select('id, title, status')
			.in('status', ['active', 'draft'])
			.order('deadline', { ascending: true, nullsFirst: false })
	])

	const hour = Number(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: timezone,
			hour: 'numeric',
			hourCycle: 'h23'
		}).format(new Date())
	)
	const partOfDay = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

	return {
		greeting: profile?.name ? `${partOfDay}, ${profile.name}` : partOfDay,
		projects: projects ?? []
	}
}

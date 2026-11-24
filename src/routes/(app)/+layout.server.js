/**
 * Everything a freelancer page needs: profile basics and the running clock.
 * @type {import('./$types').LayoutServerLoad}
 */
export const load = async ({ locals }) => {
	const { supabase, user } = locals
	const userId = user?.id ?? ''

	const [{ data: profile }, { data: clock }] = await Promise.all([
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
			.maybeSingle()
	])

	return { profile, clock }
}

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, cookies }) => {
	const { user, role, timezone } = locals

	return {
		user,
		role,
		timezone,
		// the browser Supabase client needs the auth cookies during server rendering
		cookies: cookies.getAll()
	}
}

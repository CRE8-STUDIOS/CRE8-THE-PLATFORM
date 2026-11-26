/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, cookies }) => {
	const { user, role, timezone } = locals

	return {
		user,
		role,
		timezone,
		cookies: cookies.getAll()
	}
}

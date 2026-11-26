/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
	const { data: account } = await locals.supabase
		.from('client_accounts')
		.select('id, username, display_name, email')
		.eq('auth_user_id', locals.user?.id ?? '')
		.single()

	return { account }
}

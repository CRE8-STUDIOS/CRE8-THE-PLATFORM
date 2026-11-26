/** @param {App.Locals['supabase']} supabase @param {string} userId @returns {Promise<'freelancer' | 'client' | null>} */
export const roleOf = async (supabase, userId) => {
	const [{ data: profile }, { data: account }] = await Promise.all([
		supabase.from('profiles').select('id').eq('id', userId).maybeSingle(),
		supabase.from('client_accounts').select('id').eq('auth_user_id', userId).maybeSingle()
	])
	if (profile) return 'freelancer'
	if (account) return 'client'
	return null
}

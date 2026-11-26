import { text, failMessage } from '#lib/server/form.js'

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData()
		const email = text(formData, 'email')
		const password = text(formData, 'password')

		if (!email || !password) return failMessage('Fill in all fields.', { email })
		if (password.length < 8)
			return failMessage('Use at least 8 characters for your password.', { email })

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: { account_type: 'freelancer' },
				emailRedirectTo: `${url.origin}/auth/callback?next=/welcome`
			}
		})
		if (error) return failMessage(error.message, { email })

		return { success: `Almost there! Check ${email} and click the link to confirm your account.` }
	}
}

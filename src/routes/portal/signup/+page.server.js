import { text, failMessage } from '#lib/server/form.js'

const usernameFrom = (/** @type {string} */ email) => {
	const base = (email.split('@')[0] ?? '').replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 20)
	return `${base.length >= 3 ? base : 'client'}-${crypto.randomUUID().slice(0, 6)}`
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData()
		const email = text(formData, 'email')
		const password = text(formData, 'password')
		const keep = { email }

		if (!email || !password) return failMessage('Fill in all fields.', keep)
		const username = usernameFrom(email)
		if (password.length < 8)
			return failMessage('Use at least 8 characters for your password.', keep)

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: { account_type: 'client', username, display_name: username },
				emailRedirectTo: `${url.origin}/auth/callback?next=/portal`
			}
		})
		if (error) {
			const taken = error.message.toLowerCase().includes('database error')
			return failMessage(taken ? 'That email is already in use.' : error.message, keep)
		}

		return {
			success: `Check ${email} and click the link to confirm. After that you'll see your projects.`
		}
	}
}

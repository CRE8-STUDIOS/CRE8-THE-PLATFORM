import { text, failMessage } from '#lib/server/form.js'

const USERNAME = /^[A-Za-z0-9_.-]{3,30}$/

/**
 * Client signup. The database creates the client account and, once the email is
 * confirmed, links it to every project this email was invited to.
 * @type {import('./$types').Actions}
 */
export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData()
		const email = text(formData, 'email')
		const password = text(formData, 'password')
		const username = text(formData, 'username')
		const display_name = text(formData, 'display_name')
		const keep = { email, username, display_name }

		if (!email || !password || !username) return failMessage('Fill in all fields.', keep)
		if (!USERNAME.test(username)) {
			return failMessage(
				'Username: 3 to 30 characters, only letters, numbers, dots, dashes and underscores.',
				keep
			)
		}
		if (password.length < 8)
			return failMessage('Use at least 8 characters for your password.', keep)

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: { account_type: 'client', username, display_name: display_name ?? username },
				emailRedirectTo: `${url.origin}/auth/callback?next=/portal`
			}
		})
		if (error) {
			// The database refuses duplicate usernames and emails
			const taken = error.message.toLowerCase().includes('database error')
			return failMessage(taken ? 'That username or email is already in use.' : error.message, keep)
		}

		return {
			success: `Check ${email} and click the link to confirm. After that you'll see your projects.`
		}
	}
}

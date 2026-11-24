import { text, failMessage, failWith } from '#lib/server/form.js'

const USERNAME = /^[A-Za-z0-9_.-]{3,30}$/

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, locals }) => {
		const formData = await request.formData()
		const username = text(formData, 'username')
		if (!username || !USERNAME.test(username)) {
			return failMessage(
				'Username: 3 to 30 characters, only letters, numbers, dots, dashes and underscores.'
			)
		}

		const { error } = await locals.supabase
			.from('client_accounts')
			.update({ username, display_name: text(formData, 'display_name') })
			.eq('auth_user_id', locals.user?.id ?? '')
		if (error)
			return error.code === '23505' ? failMessage('That username is taken.') : failWith(error)
		return { success: 'Saved.' }
	}
}

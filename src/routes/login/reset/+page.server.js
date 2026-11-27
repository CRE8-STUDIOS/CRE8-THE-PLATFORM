import { fail, redirect } from '@sveltejs/kit'
import { text } from '#lib/server/form.js'
import { inRecovery, endRecovery } from '#lib/server/recovery.js'

const MIN_LENGTH = 8

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, cookies }) => {
	if (!inRecovery(cookies, locals.user)) redirect(303, '/login/forgot')
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, cookies }) => {
		if (!inRecovery(cookies, locals.user)) redirect(303, '/login/forgot')

		const formData = await request.formData()
		const password = text(formData, 'password')
		const repeat = text(formData, 'repeat')

		if (!password || !repeat) return fail(400, { message: 'Fill in both fields.' })
		if (password.length < MIN_LENGTH)
			return fail(400, { message: `Use at least ${MIN_LENGTH} characters for your password.` })
		if (password !== repeat) return fail(400, { message: 'The two passwords do not match.' })

		const { error } = await locals.supabase.auth.updateUser({ password })
		if (error) return fail(400, { message: error.message })

		const as = locals.role ?? 'freelancer'
		endRecovery(cookies)
		await locals.supabase.auth.signOut()
		redirect(303, `/login/form?as=${as}&changed`)
	}
}

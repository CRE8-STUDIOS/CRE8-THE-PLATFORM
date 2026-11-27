import { fail } from '@sveltejs/kit'
import { text } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => ({
	expired: url.searchParams.has('expired')
})

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData()
		const email = text(formData, 'email')
		if (!email) return fail(400, { message: 'Fill in your email.', email })

		await locals.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/auth/callback?next=/login/reset`
		})

		return { sent: true }
	}
}

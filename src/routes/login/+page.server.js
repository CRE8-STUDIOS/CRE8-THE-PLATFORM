import { redirect } from '@sveltejs/kit'
import { text, failMessage, safeRedirect } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => ({
	redirectTo: url.searchParams.get('redirectTo') ?? '',
	error: url.searchParams.get('error') ?? ''
})

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = text(formData, 'email')
		const password = text(formData, 'password')

		if (!email || !password) return failMessage('Fill in your email and password.', { email })

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password })
		if (error) return failMessage(error.message, { email })

		redirect(303, safeRedirect(text(formData, 'redirectTo')))
	}
}

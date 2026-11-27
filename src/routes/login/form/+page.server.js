import { fail, redirect } from '@sveltejs/kit'
import { text, failMessage, safeRedirect } from '#lib/server/form.js'
import { roleOf } from '#lib/server/role.js'

const ROLES = ['freelancer', 'client']

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
	const as = url.searchParams.get('as')
	const redirectTo = url.searchParams.get('redirectTo') ?? ''
	if (!as || !ROLES.includes(as)) {
		redirect(303, redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login')
	}

	return {
		as: /** @type {'freelancer' | 'client'} */ (as),
		redirectTo,
		passwordChanged: url.searchParams.has('changed')
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = text(formData, 'email')
		const password = text(formData, 'password')
		const as = text(formData, 'as')

		if (!email || !password) return failMessage('Fill in your email and password.', { email })

		const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password })
		if (error) return failMessage(error.message, { email })

		const role = await roleOf(locals.supabase, data.user.id)
		if (role && as && role !== as) {
			await locals.supabase.auth.signOut()
			return fail(400, {
				email,
				otherRole: role,
				message: `This is a ${role} account, so it logs in as a ${role}.`
			})
		}

		redirect(303, safeRedirect(text(formData, 'redirectTo')))
	}
}

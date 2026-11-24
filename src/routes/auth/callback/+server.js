import { redirect } from '@sveltejs/kit'
import { safeRedirect } from '#lib/server/form.js'

/**
 * The link in the confirmation email lands here.
 * Supports both link styles Supabase can send: ?code=... and ?token_hash=...&type=...
 * @type {import('./$types').RequestHandler}
 */
export const GET = async ({ url, locals }) => {
	const { searchParams } = url
	const code = searchParams.get('code')
	const tokenHash = searchParams.get('token_hash')
	const type = /** @type {import('@supabase/supabase-js').EmailOtpType | null} */ (
		searchParams.get('type')
	)
	const next = safeRedirect(searchParams.get('next'))

	const confirm = async () => {
		if (code) return (await locals.supabase.auth.exchangeCodeForSession(code)).error
		if (tokenHash && type)
			return (await locals.supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error
		return { message: 'This link is incomplete.' }
	}

	const error = await confirm()
	if (error)
		redirect(303, `/login?error=${encodeURIComponent(`Confirmation failed: ${error.message}`)}`)
	redirect(303, next)
}

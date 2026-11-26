import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ locals }) => {
	await locals.supabase.auth.signOut()
	redirect(303, '/login')
}

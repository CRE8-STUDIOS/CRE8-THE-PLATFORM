import { redirect } from '@sveltejs/kit'

/**
 * Start page: send everyone to the right place.
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ locals }) => {
	const { role } = locals
	if (role === 'freelancer') redirect(303, '/welcome')
	if (role === 'client') redirect(303, '/portal')
	redirect(303, '/login')
}

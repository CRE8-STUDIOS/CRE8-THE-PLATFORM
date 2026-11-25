import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { role } = locals
	if (role === 'freelancer') redirect(303, '/welcome')
	if (role === 'client') redirect(303, '/portal')
	redirect(303, '/login')
}

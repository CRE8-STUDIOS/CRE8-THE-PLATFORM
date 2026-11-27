/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => ({
	redirectTo: url.searchParams.get('redirectTo') ?? '',
	error: url.searchParams.get('error') ?? ''
})

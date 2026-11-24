/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { data: projects } = await locals.supabase.rpc('portal_projects')
	return { projects: projects ?? [] }
}

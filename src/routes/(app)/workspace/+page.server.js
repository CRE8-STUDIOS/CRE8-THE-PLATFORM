import { workspaceTools } from '#lib/workspace/tools.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase } = locals
	const [moodboards, notes] = await Promise.all([
		supabase.from('moodboards').select('id', { count: 'exact', head: true }),
		supabase.from('notes').select('id', { count: 'exact', head: true })
	])

	return {
		tools: workspaceTools({ moodboards: moodboards.count, notes: notes.count })
	}
}

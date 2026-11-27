import { workspaceTools } from '#lib/workspace/tools.js'
import { loadTiles } from '#lib/server/workspace.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase } = locals
	const [moodboards, notes, tiles] = await Promise.all([
		supabase.from('moodboards').select('id', { count: 'exact', head: true }),
		supabase.from('notes').select('id', { count: 'exact', head: true }),
		loadTiles(supabase)
	])

	return {
		tools: workspaceTools({ moodboards: moodboards.count, notes: notes.count }),
		...tiles
	}
}

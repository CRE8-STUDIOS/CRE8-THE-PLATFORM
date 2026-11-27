import { fail, redirect } from '@sveltejs/kit'
import { workspaceTools } from '#lib/workspace/tools.js'
import { applyMove } from '#lib/workspace/tiles.js'
import { loadTiles, removeTile, savePositions } from '#lib/server/workspace.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase } = locals
	const [moodboards, notes, tiles] = await Promise.all([
		supabase.from('moodboards').select('id', { count: 'exact', head: true }),
		supabase.from('notes').select('id', { count: 'exact', head: true }),
		loadTiles(supabase)
	])
	const removeId = url.searchParams.get('remove')
	const removing = removeId
		? ([...tiles.apps, ...tiles.links].find((tile) => tile.id === removeId) ?? null)
		: null

	return {
		edit: url.searchParams.has('edit'),
		removing: removing && { id: removing.id, name: removing.name },
		tools: workspaceTools({ moodboards: moodboards.count, notes: notes.count }),
		...tiles
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	remove: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '')
		const error = id ? await removeTile(locals.supabase, id) : null
		if (error) return fail(400, { message: 'This could not be removed. Try again.' })
		redirect(303, '/workspace?edit')
	},

	reorder: async ({ request, locals }) => {
		const formData = await request.formData()
		const ids = formData.getAll('order').map(String)
		const move = formData.get('move')
		const error = await savePositions(locals.supabase, applyMove(ids, move ? String(move) : null))
		if (error) return fail(400, { message: 'The new order could not be saved. Try again.' })
		redirect(303, '/workspace?edit')
	}
}

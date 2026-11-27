import { error, json } from '@sveltejs/kit'
import { loadAgendaRange } from '#lib/server/agenda.js'
import { addDays } from '#lib/utils/dates.js'

/**
 * The items of one day, for the live "does it fit" sentence.
 * @type {import('./$types').RequestHandler}
 */
export const GET = async ({ locals, url }) => {
	const date = url.searchParams.get('date') ?? ''
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) error(400, 'Use ?date=YYYY-MM-DD')
	return json({
		items: await loadAgendaRange(locals.supabase, date, addDays(date, 1), locals.timezone)
	})
}

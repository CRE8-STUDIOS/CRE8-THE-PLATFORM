import { error } from '@sveltejs/kit'
import { ADD_TYPES, defaultAnswers } from '#lib/agenda/answers.js'
import { addAction, loadFitContext } from '#lib/server/agenda-forms.js'
import { projectOptions } from '#lib/server/projects.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params, url }) => {
	if (!ADD_TYPES.includes(params.type)) error(404, 'There is nothing like that to add.')

	const date = url.searchParams.get('date')
	const [context, projects] = await Promise.all([
		loadFitContext(locals.supabase, locals.timezone, date ?? undefined),
		projectOptions(locals.supabase)
	])

	return {
		addStep: 'form',
		type: params.type,
		query: url.search,
		answers: defaultAnswers(params.type, {
			today: context.today,
			date,
			title: url.searchParams.get('title')
		}),
		context,
		projects
	}
}

/** @type {import('./$types').Actions} */
export const actions = Object.fromEntries(ADD_TYPES.map((type) => [type, addAction(type)]))

import { error, redirect } from '@sveltejs/kit'
import { failMessage, failWith } from '#lib/server/form.js'
import { agendaItemFromForm } from '#lib/server/agenda.js'
import { projectOptions } from '#lib/server/projects.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const [{ data: item }, projects] = await Promise.all([
		locals.supabase.from('agenda_items').select('*').eq('id', params.id).maybeSingle(),
		projectOptions(locals.supabase)
	])
	if (!item) error(404, 'Agenda item not found')
	return { item, projects }
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, params }) => {
		const item = agendaItemFromForm(await request.formData(), locals.timezone)
		if (!item.title) return failMessage('Give it a title.')

		const { error: updateError } = await locals.supabase
			.from('agenda_items')
			.update(/** @type {any} */ (item))
			.eq('id', params.id)
		if (updateError) return failWith(updateError)
		redirect(303, `/agenda/${params.id}`)
	}
}

import { redirect } from '@sveltejs/kit'
import { checkbox, failMessage, failWith } from '#lib/server/form.js'
import { agendaItemFromForm } from '#lib/server/agenda.js'
import { projectOptions } from '#lib/server/projects.js'
import { todayIn } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => ({ projects: await projectOptions(locals.supabase) })

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const item = agendaItemFromForm(formData, locals.timezone)
		if (!item.title) return failMessage('Give it a title.')

		const { data, error } = await locals.supabase
			.from('agenda_items')
			.insert(/** @type {any} */ (item))
			.select('id, starts_at')
			.single()
		if (error) return failWith(error)

		if (checkbox(formData, 'open_after') || !data.starts_at) redirect(303, `/agenda/${data.id}`)
		redirect(303, `/agenda?date=${todayIn(locals.timezone, new Date(data.starts_at))}`)
	}
}

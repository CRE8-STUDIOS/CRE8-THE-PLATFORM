import { redirect } from '@sveltejs/kit'
import { text, oneOf, failWith, safeRedirect } from '#lib/server/form.js'
import { TIME_CATEGORIES, CLOCK_START_SOURCES, CLOCK_STOP_REASONS } from '#lib/utils/constants.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async () => redirect(303, '/time')

/** @type {import('./$types').Actions} */
export const actions = {
	in: async ({ request, locals }) => {
		const formData = await request.formData()

		const { error } = await locals.supabase.rpc('clock_in', {
			p_project_id: text(formData, 'project_id') ?? undefined,
			p_category: oneOf(text(formData, 'category'), TIME_CATEGORIES, 'client_work'),
			p_started_by: oneOf(text(formData, 'started_by'), CLOCK_START_SOURCES, 'manual'),
			p_agenda_item_id: text(formData, 'agenda_item_id') ?? undefined,
			p_note: text(formData, 'note') ?? undefined
		})
		if (error) return failWith(error)

		redirect(303, safeRedirect(text(formData, 'redirectTo'), '/overview'))
	},

	/** Stops the running entry as a switch and starts one on the new project */
	switch: async ({ request, locals }) => {
		const formData = await request.formData()

		const stopped = await locals.supabase.rpc('clock_out', { p_reason: 'switch' })
		if (stopped.error) return failWith(stopped.error)

		const { error } = await locals.supabase.rpc('clock_in', {
			p_project_id: text(formData, 'project_id') ?? undefined,
			p_category: oneOf(text(formData, 'category'), TIME_CATEGORIES, 'client_work'),
			p_started_by: 'manual'
		})
		if (error) return failWith(error)

		redirect(303, safeRedirect(text(formData, 'redirectTo'), '/overview'))
	},

	out: async ({ request, locals }) => {
		const formData = await request.formData()

		const { error } = await locals.supabase.rpc('clock_out', {
			p_reason: oneOf(text(formData, 'reason'), CLOCK_STOP_REASONS, 'manual'),
			p_at: text(formData, 'at') ?? undefined
		})
		if (error) return failWith(error)

		redirect(303, safeRedirect(text(formData, 'redirectTo'), '/overview'))
	}
}

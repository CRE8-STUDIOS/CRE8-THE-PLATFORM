import { redirect } from '@sveltejs/kit'
import { id, text, failWith } from '#lib/server/form.js'
import { minutesText, taskColumns } from '#lib/agenda/lists.js'
import { freeMinutes } from '#lib/agenda/fit.js'
import { loadFitContext } from '#lib/server/agenda-forms.js'
import { addDays } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const context = await loadFitContext(locals.supabase, locals.timezone)
	const { today } = context
	const { data: tasks, error } = await locals.supabase
		.from('agenda_items')
		.select('id, title, due_date, status, priority, estimated_minutes')
		.eq('type', 'task')
		.or(`due_date.is.null,and(due_date.gte.${today},due_date.lte.${addDays(today, 8)})`)
	if (error) throw error

	const columns = taskColumns(tasks ?? [], today)
	const planned = columns.today.open.reduce(
		(total, task) => total + (task.estimated_minutes ?? 0),
		0
	)

	return {
		...columns,
		meta: `${minutesText(planned) || '0 min'} today · ${minutesText(freeMinutes(today, context)) || '0 min'} free`,
		showUndated: url.searchParams.has('undated')
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	done: async ({ request, locals }) => {
		const formData = await request.formData()
		const done = text(formData, 'status') === 'done'
		const { error } = await locals.supabase
			.from('agenda_items')
			.update({
				status: done ? 'done' : 'open',
				completed_at: done ? new Date().toISOString() : null
			})
			.eq('id', id(formData))
			.eq('type', 'task')
		if (error) return failWith(error)
		redirect(303, '/agenda/tasks')
	}
}

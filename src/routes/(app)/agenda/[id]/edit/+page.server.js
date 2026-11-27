import { error, fail, redirect } from '@sveltejs/kit'
import { formTypeOf, itemToAnswers, readAnswers } from '#lib/agenda/answers.js'
import { loadFitContext, prepareItem } from '#lib/server/agenda-forms.js'
import { projectOptions } from '#lib/server/projects.js'
import { addDays, toLocalInput } from '#lib/utils/dates.js'

const DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * The item and a fit context without the item itself, so it never overlaps with itself.
 * @param {App.Locals} locals
 * @param {string} id
 * @param {string | undefined} day
 */
const loadEditable = async (locals, id, day) => {
	const [{ data: item }, context] = await Promise.all([
		locals.supabase.from('agenda_items').select('*').eq('id', id).maybeSingle(),
		loadFitContext(locals.supabase, locals.timezone, day)
	])
	if (!item) error(404, 'Agenda item not found')
	return { item, context: { ...context, items: context.items.filter((other) => other.id !== id) } }
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params, url }) => {
	const on = url.searchParams.get('on')
	const occurrence = on && DATE.test(on) ? on : null
	const [{ item, context }, projects] = await Promise.all([
		loadEditable(locals, params.id, occurrence ?? undefined),
		projectOptions(locals.supabase)
	])

	const answers = itemToAnswers(item, context)
	if (occurrence && item.recurrence_rule) {
		const day =
			occurrence === context.today
				? 'today'
				: occurrence === addDays(context.today, 1)
					? 'tomorrow'
					: 'pick'
		Object.assign(answers, { day, date: occurrence })
	}

	return {
		item: { id: item.id, title: item.title },
		type: formTypeOf(item.type),
		repeating: Boolean(item.recurrence_rule),
		occurrence,
		answers,
		context,
		projects
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, params, url }) => {
		const formData = await request.formData()
		const answers = readAnswers(formData)
		const on = url.searchParams.get('on')
		const occurrence = on && DATE.test(on) ? on : null
		const { item, context } = await loadEditable(locals, params.id, answers.date)
		const type = formTypeOf(item.type)
		const repeating = Boolean(item.recurrence_rule)
		const onlyThis = repeating && occurrence && answers.scope === 'one'

		// Changing the whole series keeps its first date, only the times and details change
		const series =
			repeating && !onlyThis && item.starts_at
				? {
						...answers,
						day: 'pick',
						date: toLocalInput(item.starts_at, locals.timezone).slice(0, 10)
					}
				: answers
		const { values, errors, sentence } = prepareItem(type, series, context)
		if (Object.keys(errors).length) return fail(400, { errors, answers, sentence })

		if (onlyThis) {
			const exceptions = [...new Set([...(item.recurrence_exceptions ?? []), occurrence])]
			const [{ error: seriesError }, { data: single, error: insertError }] = await Promise.all([
				locals.supabase
					.from('agenda_items')
					.update({ recurrence_exceptions: exceptions })
					.eq('id', item.id),
				locals.supabase
					.from('agenda_items')
					.insert(/** @type {any} */ ({ ...values, recurrence_rule: null }))
					.select('id')
					.single()
			])
			const failed = seriesError ?? insertError
			if (failed || !single)
				return fail(400, { errors: { form: failed?.message ?? 'Not saved.' }, answers, sentence })
			redirect(303, `/agenda/${single.id}`)
		}

		const { error: updateError } = await locals.supabase
			.from('agenda_items')
			.update(/** @type {any} */ (values))
			.eq('id', item.id)
		if (updateError) return fail(400, { errors: { form: updateError.message }, answers, sentence })
		redirect(303, `/agenda/${item.id}${occurrence ? `?on=${occurrence}` : ''}`)
	}
}

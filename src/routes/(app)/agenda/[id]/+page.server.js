import { error, redirect } from '@sveltejs/kit'
import { id, text, failMessage, failWith } from '#lib/server/form.js'
import { todayIn } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params, url }) => {
	const { supabase } = locals
	const [{ data: item }, { data: checklist }, { data: people }] = await Promise.all([
		supabase.from('agenda_items').select('*, projects(title)').eq('id', params.id).maybeSingle(),
		supabase
			.from('agenda_checklist_items')
			.select('id, label, done')
			.eq('agenda_item_id', params.id)
			.order('position'),
		supabase
			.from('agenda_people')
			.select('id, name, role, email, phone')
			.eq('agenda_item_id', params.id)
			.order('created_at')
	])
	if (!item) error(404, 'Agenda item not found')

	const day = item.starts_at
		? todayIn(locals.timezone, new Date(item.starts_at))
		: (item.due_date ?? todayIn(locals.timezone))

	return {
		backHref: `/agenda?date=${day}`,
		confirmDelete: url.searchParams.has('delete'),
		occurrence: /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('on') ?? '')
			? url.searchParams.get('on')
			: null,
		item,
		checklist: checklist ?? [],
		people: people ?? [],
		canStart: Boolean(item.starts_at) && ['work', 'meeting'].includes(item.type)
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	delete: async ({ request, locals, params, url }) => {
		const scope = text(await request.formData(), 'scope')
		const on = url.searchParams.get('on')

		if (scope === 'one' && on && /^\d{4}-\d{2}-\d{2}$/.test(on)) {
			const { data: item } = await locals.supabase
				.from('agenda_items')
				.select('recurrence_exceptions')
				.eq('id', params.id)
				.maybeSingle()
			const exceptions = [...new Set([...(item?.recurrence_exceptions ?? []), on])]
			const { error: updateError } = await locals.supabase
				.from('agenda_items')
				.update({ recurrence_exceptions: exceptions })
				.eq('id', params.id)
			if (updateError) return failWith(updateError)
			redirect(303, `/agenda?date=${on}`)
		}

		const { error: deleteError } = await locals.supabase
			.from('agenda_items')
			.delete()
			.eq('id', params.id)
		if (deleteError) return failWith(deleteError)
		redirect(303, '/agenda')
	},

	addCheck: async ({ request, locals, params }) => {
		const { supabase } = locals
		const label = text(await request.formData(), 'label')
		if (!label) return failMessage('Type something to add.')

		const { count } = await supabase
			.from('agenda_checklist_items')
			.select('id', { count: 'exact', head: true })
			.eq('agenda_item_id', params.id)
		const { error: insertError } = await supabase
			.from('agenda_checklist_items')
			.insert({ agenda_item_id: params.id, label, position: count ?? 0 })
		if (insertError) return failWith(insertError)
	},

	toggleCheck: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error: updateError } = await locals.supabase
			.from('agenda_checklist_items')
			.update({ done: text(formData, 'done') !== 'true' })
			.eq('id', id(formData))
		if (updateError) return failWith(updateError)
	},

	deleteCheck: async ({ request, locals }) => {
		const { error: deleteError } = await locals.supabase
			.from('agenda_checklist_items')
			.delete()
			.eq('id', id(await request.formData()))
		if (deleteError) return failWith(deleteError)
	},

	addPerson: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const name = text(formData, 'name')
		if (!name) return failMessage('Fill in a name.')

		const { error: insertError } = await locals.supabase.from('agenda_people').insert({
			agenda_item_id: params.id,
			name,
			role: text(formData, 'role'),
			email: text(formData, 'email'),
			phone: text(formData, 'phone')
		})
		if (insertError) return failWith(insertError)
	},

	deletePerson: async ({ request, locals }) => {
		const { error: deleteError } = await locals.supabase
			.from('agenda_people')
			.delete()
			.eq('id', id(await request.formData()))
		if (deleteError) return failWith(deleteError)
	}
}

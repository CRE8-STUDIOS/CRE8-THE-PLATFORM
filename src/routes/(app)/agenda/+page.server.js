import { redirect } from '@sveltejs/kit'
import { id, text, number, checkbox, failMessage, failWith } from '#lib/server/form.js'
import { agendaItemFromForm } from '#lib/server/agenda.js'
import { projectOptions } from '#lib/server/projects.js'
import { todayIn, mondayOf, addDays, toUtcIso, dateParam, formatDay } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone } = locals
	const monday = mondayOf(dateParam(url.searchParams.get('week'), todayIn(timezone)))
	const from = toUtcIso(monday, timezone) ?? ''
	const to = toUtcIso(addDays(monday, 7), timezone) ?? ''

	const [items, inbox, meetings, projects] = await Promise.all([
		supabase
			.from('agenda_items')
			.select('id, type, title, starts_at, ends_at, all_day, status, is_protected, projects(title)')
			.gte('starts_at', from)
			.lt('starts_at', to)
			.order('starts_at'),
		supabase
			.from('agenda_items')
			.select('id, type, title, due_date, status, estimated_minutes, projects(title)')
			.is('starts_at', null)
			.eq('status', 'open')
			.order('due_date', { nullsFirst: false }),
		supabase
			.from('meeting_requests')
			.select('id, starts_at, ends_at, message, projects(title, clients(name))')
			.eq('status', 'pending')
			.order('starts_at'),
		projectOptions(supabase)
	])

	const week = Array.from({ length: 7 }, (_, index) => {
		const date = addDays(monday, index)
		return {
			date,
			label: formatDay(date),
			items: (items.data ?? []).filter(
				({ starts_at }) => starts_at && todayIn(timezone, new Date(starts_at)) === date
			)
		}
	})

	return {
		monday,
		previousWeek: addDays(monday, -7),
		nextWeek: addDays(monday, 7),
		week,
		inbox: inbox.data ?? [],
		meetings: meetings.data ?? [],
		projects
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData()
		const item = agendaItemFromForm(formData, locals.timezone)
		if (!item.title) return failMessage('Give it a title.')

		const { data, error } = await locals.supabase
			.from('agenda_items')
			.insert(/** @type {any} */ (item))
			.select('id')
			.single()
		if (error) return failWith(error)

		if (checkbox(formData, 'open_after')) redirect(303, `/agenda/${data.id}`)
		return { success: 'Added.' }
	},

	toggleDone: async ({ request, locals }) => {
		const formData = await request.formData()
		const done = text(formData, 'status') !== 'done'
		const { error } = await locals.supabase
			.from('agenda_items')
			.update({
				status: done ? 'done' : 'open',
				completed_at: done ? new Date().toISOString() : null
			})
			.eq('id', id(formData))
		if (error) return failWith(error)
		return { success: done ? 'Done.' : 'Open again.' }
	},

	schedule: async ({ request, locals }) => {
		const formData = await request.formData()
		const startsAt = toUtcIso(text(formData, 'starts_at'), locals.timezone)
		if (!startsAt) return failMessage('Pick a time.')

		const minutes = number(formData, 'minutes') ?? 60
		const endsAt = new Date(new Date(startsAt).getTime() + minutes * 60_000).toISOString()
		const { error } = await locals.supabase
			.from('agenda_items')
			.update({ starts_at: startsAt, ends_at: endsAt })
			.eq('id', id(formData))
		if (error) return failWith(error)
		return { success: 'Planned.' }
	},

	answerMeeting: async ({ request, locals }) => {
		const formData = await request.formData()
		const accept = text(formData, 'accept') === 'true'
		const { error } = await locals.supabase.rpc('respond_to_meeting_request', {
			p_id: id(formData),
			p_accept: accept
		})
		if (error) return failWith(error)
		return { success: accept ? 'Meeting accepted and added to your agenda.' : 'Meeting declined.' }
	}
}

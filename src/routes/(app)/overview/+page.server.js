import { todayIn, dayRange } from '#lib/utils/dates.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { supabase, timezone } = locals
	const today = todayIn(timezone)
	const { start, end } = dayRange(today, timezone)

	const [
		agenda,
		dueTasks,
		projects,
		draftContracts,
		requestedRequests,
		draftInvoices,
		meetings,
		tiles
	] = await Promise.all([
		supabase
			.from('agenda_items')
			.select('id, type, title, starts_at, all_day, status, projects(title)')
			.gte('starts_at', start)
			.lt('starts_at', end)
			.order('starts_at'),
		supabase
			.from('agenda_items')
			.select('id, type, title, due_date, projects(title)')
			.is('starts_at', null)
			.eq('status', 'open')
			.lte('due_date', today)
			.order('due_date'),
		supabase
			.from('projects')
			.select('id, title, deadline')
			.eq('status', 'active')
			.order('deadline'),
		supabase
			.from('contracts')
			.select('id, title, project_id, projects(title)')
			.eq('status', 'draft'),
		supabase
			.from('requests')
			.select('id, title, project_id, projects(title)')
			.eq('status', 'requested'),
		supabase.from('invoices').select('id, clients(name)').eq('status', 'draft'),
		supabase
			.from('meeting_requests')
			.select('id, starts_at, projects(title)')
			.eq('status', 'pending')
			.order('starts_at'),
		supabase.from('dashboard_tiles').select('id, name, url, group_name').order('position')
	])

	const toDo = [
		...(draftContracts.data ?? []).map(({ id, title, project_id, projects }) => ({
			id,
			text: `Contract to send: ${title} (${projects?.title ?? 'project'})`,
			href: `/projects/${project_id}/contract`
		})),
		...(requestedRequests.data ?? []).map(({ id, title, project_id, projects }) => ({
			id,
			text: `Client asked for "${title}" (${projects?.title ?? 'project'}): add a price`,
			href: `/projects/${project_id}/requests`
		})),
		...(draftInvoices.data ?? []).map(({ id, clients }) => ({
			id,
			text: `Factuur to send for ${clients?.name ?? 'a client'}`,
			href: `/finance/invoices/${id}`
		})),
		...(meetings.data ?? []).map(({ id, projects }) => ({
			id,
			text: `Meeting request for ${projects?.title ?? 'a project'}`,
			href: '/agenda'
		}))
	]

	return {
		today,
		agenda: agenda.data ?? [],
		dueTasks: dueTasks.data ?? [],
		projectLinks: (projects.data ?? []).map(({ id, title, deadline }) => ({
			id,
			text: deadline ? `${title} · deadline ${deadline}` : title,
			href: `/projects/${id}`
		})),
		toDo,
		tiles: tiles.data ?? []
	}
}

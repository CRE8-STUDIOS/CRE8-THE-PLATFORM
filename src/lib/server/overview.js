import { loadAgendaRange } from '#lib/server/agenda.js'
import { addDays, dayRange, formatTime, todayIn } from '#lib/utils/dates.js'
import { deadlineText, sortTasks } from '#lib/agenda/lists.js'
import { itemHref } from '#lib/agenda/timeline.js'
import {
	cardProgress,
	currentItem,
	deadlineLine,
	leaveTime,
	minutesBetween,
	nextStep,
	projectStage,
	upNext,
	DEADLINE_DAYS
} from '#lib/overview/helpers.js'

/**
 * @typedef {import('#lib/server/guide.js').Supabase} Supabase
 * @typedef {import('#lib/overview/helpers.js').Card} Card
 */

/** Group rows by a key */
const groupBy = (/** @type {any[]} */ rows, /** @type {string} */ key) => {
	/** @type {Map<string, any[]>} */
	const groups = new Map()
	for (const row of rows) groups.set(row[key], [...(groups.get(row[key]) ?? []), row])
	return groups
}

/** The client of a project as one name */
const clientName = (/** @type {{ name: string, company: string | null } | null} */ client) =>
	client ? client.company || client.name : null

/**
 * Everything the overview shows, in one load. It never selects a price,
 * amount or total: this page stays open in public.
 * @param {Supabase} supabase
 * @param {{ timeZone: string, clock: { started_at: string, project_id: string | null } | null }} options
 */
export const loadOverview = async (supabase, { timeZone, clock }) => {
	const today = todayIn(timeZone)
	const now = new Date().toISOString()
	const { start } = dayRange(today, timeZone)
	const until = addDays(today, DEADLINE_DAYS)

	const [
		items,
		projects,
		cards,
		agendaDeadlines,
		entries,
		invoices,
		contracts,
		requests,
		projectCount,
		itemCount
	] = await Promise.all([
		loadAgendaRange(supabase, today, addDays(today, 1), timeZone),
		supabase
			.from('projects')
			.select('id, title, deadline, clients(name, company)')
			.eq('status', 'active')
			.order('deadline', { nullsFirst: false }),
		supabase
			.from('agenda_items')
			.select(
				'id, title, type, board_status, due_date, project_id, status, estimated_minutes, starts_at'
			)
			.not('project_id', 'is', null),
		supabase
			.from('agenda_items')
			.select('id, title, due_date, project_id')
			.eq('type', 'deadline')
			.neq('status', 'done')
			.gte('due_date', today)
			.lte('due_date', until),
		supabase.from('time_entries').select('started_at, ended_at').gte('started_at', start),
		supabase
			.from('invoices')
			.select('id, invoice_number, clients(name, company)')
			.eq('status', 'draft')
			.lte('issue_date', today),
		supabase
			.from('contracts')
			.select('id, title, status, project_id, projects(clients(name, company))')
			.in('status', ['draft', 'sent']),
		supabase
			.from('requests')
			.select('id, title, project_id, projects(clients(name, company))')
			.eq('status', 'sent'),
		supabase.from('projects').select('id', { count: 'exact', head: true }),
		supabase.from('agenda_items').select('id', { count: 'exact', head: true })
	])

	const activeProjects = projects.data ?? []
	const byProject = groupBy(cards.data ?? [], 'project_id')
	const boardOf = (/** @type {string} */ id) =>
		/** @type {Card[]} */ ((byProject.get(id) ?? []).filter((card) => card.board_status))
	const projectById = new Map(activeProjects.map((project) => [project.id, project]))

	// Right now
	const current = currentItem(items, now, clock)
	const currentProjectId =
		current?.kind === 'clock' ? current.projectId : (current?.item.project_id ?? null)
	const currentProject = currentProjectId ? projectById.get(currentProjectId) : null
	const board = currentProjectId ? boardOf(currentProjectId) : []
	const step = nextStep(board)
	const rightNow = current && {
		when:
			current.kind === 'now'
				? `until ${formatTime(String(current.item.ends_at), timeZone)}`
				: current.kind === 'next'
					? `at ${formatTime(String(current.item.starts_at), timeZone)}`
					: 'clocked in',
		title:
			currentProject?.title ?? (current.kind === 'clock' ? 'Your project' : current.item.title),
		line: [
			current.kind === 'clock' ? null : current.item.title,
			clientName(currentProject?.clients ?? null)
		]
			.filter(Boolean)
			.join(' · '),
		nextStep: step?.title ?? null,
		progress: board.length ? cardProgress(board) : null,
		projectId: currentProject?.id ?? null
	}

	// Meetings
	const meetings = items
		.filter((item) => item.type === 'meeting' && item.starts_at)
		.sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))
		.map((item) => {
			const leave = leaveTime(item)
			return {
				id: item.id,
				href: itemHref(item),
				time: formatTime(String(item.starts_at), timeZone),
				title: item.title,
				place: item.meeting_url
					? 'link in agenda'
					: [item.location_name, item.address].filter(Boolean).join(', ') || null,
				end: leave ? `Leave ${formatTime(leave, timeZone)}` : item.meeting_url ? 'Online' : null
			}
		})

	// To send and sign: titles and states, never an amount
	const toSend = [
		...(invoices.data ?? []).map((invoice) => ({
			id: invoice.id,
			kind: 'Invoice',
			title: invoice.invoice_number ?? 'Draft invoice',
			line: clientName(invoice.clients) ? `for ${clientName(invoice.clients)}` : 'ready to send',
			status: 'Send today',
			href: `/finance/invoices/${invoice.id}`
		})),
		...(contracts.data ?? []).map((contract) => {
			const client = clientName(contract.projects?.clients ?? null)
			return {
				id: contract.id,
				kind: 'Contract',
				title: contract.title,
				line:
					contract.status === 'draft'
						? `send to ${client ?? 'your client'} to sign`
						: `${client ?? 'Your client'} has not signed yet`,
				status: contract.status === 'draft' ? 'Draft ready' : 'Waiting',
				href: `/projects/${contract.project_id}/contract`
			}
		}),
		...(requests.data ?? []).map((request) => ({
			id: request.id,
			kind: 'Request',
			title: request.title,
			line: `${clientName(request.projects?.clients ?? null) ?? 'Your client'} has not signed yet`,
			status: 'Waiting',
			href: `/projects/${request.project_id}/requests`
		}))
	]

	// Tasks today
	const tasks = sortTasks(
		items
			.filter((item) => item.type === 'task' && item.due_date === today)
			.map((item) => ({
				id: item.id,
				title: item.title,
				due_date: item.due_date ?? null,
				status: item.status ?? 'open',
				priority: item.priority ?? null,
				estimated_minutes: item.estimated_minutes ?? null
			}))
	)

	// Deadlines in the next two weeks
	const deadlines = [
		...activeProjects
			.filter(
				(project) => project.deadline && project.deadline >= today && project.deadline <= until
			)
			.map((project) => {
				const own = byProject.get(project.id) ?? []
				return {
					id: project.id,
					title: project.title,
					date: /** @type {string} */ (project.deadline),
					href: `/projects/${project.id}`,
					line: deadlineLine({
						tasks: own.filter((row) => row.type === 'task'),
						blocks: own.filter(
							(row) =>
								row.type === 'work' &&
								row.starts_at &&
								row.starts_at >= now &&
								row.starts_at.slice(0, 10) <= String(project.deadline)
						),
						timeZone
					})
				}
			}),
		...(agendaDeadlines.data ?? []).map((item) => ({
			id: item.id,
			title: item.title,
			date: /** @type {string} */ (item.due_date),
			href: `/agenda/${item.id}`,
			line: item.project_id ? (projectById.get(item.project_id)?.title ?? null) : null
		}))
	]
		.sort((a, b) => a.date.localeCompare(b.date))
		.map((deadline) => ({ ...deadline, when: deadlineText(deadline.date, today) }))

	// Clocked time today, without the running entry (the page counts that live)
	const closedMinutes = (entries.data ?? [])
		.filter((entry) => entry.ended_at)
		.reduce((sum, entry) => sum + minutesBetween(entry.started_at, String(entry.ended_at)), 0)

	return {
		today,
		now,
		closedMinutes,
		rightNow,
		upNext: upNext(items, now, timeZone),
		meetings,
		toSend,
		tasks,
		deadlines,
		projects: activeProjects.map((project) => {
			const own = boardOf(project.id)
			return {
				id: project.id,
				title: project.title,
				stage: projectStage(own),
				client: clientName(project.clients) ?? 'Own project',
				deadline: project.deadline,
				next: nextStep(own)?.title ?? null
			}
		}),
		empty: !projectCount.count && !itemCount.count
	}
}

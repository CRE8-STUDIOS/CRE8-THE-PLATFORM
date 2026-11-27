import { cardStatus, deadlineText } from '#lib/agenda/lists.js'
import { todayIn } from '#lib/utils/dates.js'

const COLUMNS = [
	{ status: 'todo', heading: 'Todo' },
	{ status: 'in_progress', heading: 'In progress' },
	{ status: 'in_review', heading: 'In review' },
	{ status: 'done', heading: 'Done' }
]

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, timezone } = locals
	const today = todayIn(timezone)

	const [{ data: projects }, { data: onBoard }] = await Promise.all([
		supabase
			.from('projects')
			.select('id, title, deadline, clients(name)')
			.in('status', ['draft', 'active'])
			.order('title'),
		supabase.from('agenda_items').select('project_id').not('board_status', 'is', null)
	])

	const list = projects ?? []
	const withCards = new Set((onBoard ?? []).map((row) => row.project_id))
	const chosen =
		list.find((project) => project.id === url.searchParams.get('project')) ??
		list.find((project) => withCards.has(project.id)) ??
		list[0] ??
		null

	const { data: cards } = chosen
		? await supabase
				.from('agenda_items')
				.select('id, title, board_status, client_review_status, due_date')
				.eq('project_id', chosen.id)
				.not('board_status', 'is', null)
				.order('due_date', { nullsFirst: false })
		: { data: [] }

	const client = chosen?.clients?.name ?? null
	return {
		projects: list.map((project) => ({ value: project.id, label: project.title })),
		project: chosen
			? {
					id: chosen.id,
					title: chosen.title,
					meta: [
						client,
						chosen.deadline
							? `deadline ${deadlineText(chosen.deadline, today).toLowerCase()}`
							: null
					]
						.filter(Boolean)
						.join(' · ')
				}
			: null,
		columns: COLUMNS.map((column) => ({
			heading: column.heading,
			cards: (cards ?? [])
				.filter((card) => card.board_status === column.status)
				.map((card) => ({ id: card.id, title: card.title, status: cardStatus(card, client) }))
		}))
	}
}

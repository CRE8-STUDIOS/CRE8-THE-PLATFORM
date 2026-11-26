import { error } from '@sveltejs/kit'
import { id, text, failWith } from '#lib/server/form.js'
import { signedUrls } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { supabase } = locals
	const { projectId } = params

	const { data: projects } = await supabase.rpc('portal_projects')
	const project = (projects ?? []).find(({ project_id }) => project_id === projectId)
	if (!project) error(404, 'Project not found')

	await supabase.rpc('portal_touch', { p_project_id: projectId })

	const today = new Date().toISOString().slice(0, 10)
	const [updates, contract, requests, invoices, files, boards, meetings, slots] = await Promise.all(
		[
			supabase
				.from('project_updates')
				.select('id, title, body, created_at')
				.eq('project_id', projectId)
				.order('created_at', { ascending: false }),
			supabase
				.from('contracts')
				.select('id, title, body, status, signed_at, signed_ip, signature_data')
				.eq('project_id', projectId)
				.maybeSingle(),
			supabase
				.from('requests')
				.select('id, title, description, price, estimated_hours, status')
				.eq('project_id', projectId)
				.order('created_at', { ascending: false }),
			supabase
				.from('invoice_overview')
				.select(
					'id, invoice_number, status, issue_date, due_date, subtotal, vat_total, total, is_overdue'
				)
				.eq('project_id', projectId)
				.order('issue_date', { ascending: false }),
			supabase
				.from('project_files')
				.select('id, name, file_path')
				.eq('project_id', projectId)
				.order('created_at', { ascending: false }),
			supabase
				.from('moodboards')
				.select('id, title, moodboard_items(id, type, content, image_path, z_index)')
				.eq('project_id', projectId),
			supabase
				.from('meeting_requests')
				.select('id, starts_at, ends_at, status')
				.eq('project_id', projectId)
				.in('status', ['pending', 'accepted'])
				.order('starts_at'),
			supabase.rpc('get_available_slots', { p_project_id: projectId, p_from: today, p_days: 14 })
		]
	)

	const invoiceIds = (invoices.data ?? [])
		.map(({ id: invoiceId }) => invoiceId)
		.filter((invoiceId) => invoiceId !== null)
	const { data: lines } = invoiceIds.length
		? await supabase
				.from('invoice_lines')
				.select('id, invoice_id, description, quantity, unit_price, vat_rate')
				.in('invoice_id', invoiceIds)
				.order('position')
		: { data: [] }

	const boardList = boards.data ?? []
	const fileList = files.data ?? []
	const [fileUrls, imageUrls] = await Promise.all([
		signedUrls(
			supabase,
			'project-files',
			fileList.map(({ file_path }) => file_path)
		),
		signedUrls(
			supabase,
			'moodboards',
			boardList.flatMap(({ moodboard_items }) =>
				moodboard_items.map(({ image_path }) => image_path)
			)
		)
	])

	return {
		project,
		updates: updates.data ?? [],
		contract: contract.data,
		requests: requests.data ?? [],
		invoices: (invoices.data ?? []).map((invoice) => ({
			...invoice,
			lines: (lines ?? []).filter(({ invoice_id }) => invoice_id === invoice.id)
		})),
		files: fileList.map(({ id: fileId, name, file_path }) => ({
			id: fileId,
			name,
			url: fileUrls[file_path] ?? null
		})),
		boards: boardList.map(({ id: boardId, title, moodboard_items }) => ({
			id: boardId,
			title,
			items: [...moodboard_items]
				.sort((a, b) => a.z_index - b.z_index)
				.map(({ id: itemId, type, content, image_path }) => ({
					id: itemId,
					type,
					content,
					imageUrl: image_path ? (imageUrls[image_path] ?? null) : null
				}))
		})),
		meetings: meetings.data ?? [],
		slots: slots.data ?? []
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	signContract: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error: signError } = await locals.supabase.rpc('sign_contract', {
			p_contract_id: id(formData, 'contract_id'),
			p_signature: text(formData, 'signature') ?? ''
		})
		if (signError) return failWith(signError)
		return { success: 'Contract signed. Thank you!' }
	},

	approveRequest: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error: approveError } = await locals.supabase.rpc('respond_to_request', {
			p_request_id: id(formData, 'request_id'),
			p_approve: true,
			p_signature: text(formData, 'signature') ?? ''
		})
		if (approveError) return failWith(approveError)
		return { success: 'Request approved and signed.' }
	},

	declineRequest: async ({ request, locals }) => {
		const { error: declineError } = await locals.supabase.rpc('respond_to_request', {
			p_request_id: id(await request.formData(), 'request_id'),
			p_approve: false
		})
		if (declineError) return failWith(declineError)
		return { success: 'Request declined.' }
	},

	createRequest: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const { error: createError } = await locals.supabase.rpc('client_create_request', {
			p_project_id: params.projectId,
			p_title: text(formData, 'title') ?? '',
			p_description: text(formData, 'description') ?? undefined
		})
		if (createError) return failWith(createError)
		return { success: 'Sent! You will get a price to approve.' }
	},

	requestMeeting: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const { error: meetingError } = await locals.supabase.rpc('request_meeting', {
			p_project_id: params.projectId,
			p_starts_at: text(formData, 'starts_at') ?? '',
			p_message: text(formData, 'message') ?? undefined
		})
		if (meetingError) return failWith(meetingError)
		return { success: 'Meeting requested. You will see it here once it is confirmed.' }
	},

	cancelMeeting: async ({ request, locals }) => {
		const { error: cancelError } = await locals.supabase.rpc('cancel_meeting_request', {
			p_id: id(await request.formData())
		})
		if (cancelError) return failWith(cancelError)
		return { success: 'Meeting cancelled.' }
	}
}

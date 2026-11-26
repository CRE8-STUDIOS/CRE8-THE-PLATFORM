import { text, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { supabase } = locals
	const [{ data: contract }, { data: templates }] = await Promise.all([
		supabase.from('contracts').select('*').eq('project_id', params.id).maybeSingle(),
		supabase.from('contract_templates').select('id, name').order('name')
	])

	return {
		contract,
		templates: (templates ?? []).map(({ id, name }) => ({ value: id, label: name }))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, locals, params }) => {
		const { supabase } = locals
		const formData = await request.formData()
		const templateId = text(formData, 'template_id')

		const { data: template } = templateId
			? await supabase.from('contract_templates').select('body').eq('id', templateId).single()
			: { data: null }

		const { error } = await supabase.from('contracts').insert({
			project_id: params.id,
			title: text(formData, 'title') ?? 'Contract',
			body: template?.body ?? ''
		})
		if (error) return failWith(error)
		return { success: 'Contract created.' }
	},

	save: async ({ request, locals, params }) => {
		const formData = await request.formData()
		const { error } = await locals.supabase
			.from('contracts')
			.update({ title: text(formData, 'title') ?? 'Contract', body: text(formData, 'body') ?? '' })
			.eq('project_id', params.id)
		if (error) return failWith(error)
		return { success: 'Saved.' }
	},

	send: async ({ locals, params }) => {
		const { error } = await locals.supabase
			.from('contracts')
			.update({ status: 'sent', sent_at: new Date().toISOString() })
			.eq('project_id', params.id)
		if (error) return failWith(error)
		return { success: 'Sent. Your client can now sign it in the portal.' }
	},

	withdraw: async ({ locals, params }) => {
		const { error } = await locals.supabase
			.from('contracts')
			.update({ status: 'draft', sent_at: null })
			.eq('project_id', params.id)
		if (error) return failWith(error)
		return { success: 'Back to draft. The client no longer sees it.' }
	},

	delete: async ({ locals, params }) => {
		const { error } = await locals.supabase.from('contracts').delete().eq('project_id', params.id)
		if (error) return failWith(error)
		return { success: 'Contract deleted.' }
	}
}

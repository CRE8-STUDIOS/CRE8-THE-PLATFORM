import { id, text, failMessage, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { data: templates } = await locals.supabase
		.from('contract_templates')
		.select('id, name, body')
		.order('name')
	return { templates: templates ?? [] }
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals }) => {
		const formData = await request.formData()
		const name = text(formData, 'name')
		if (!name) return failMessage('Give the template a name.')

		const { error } = await locals.supabase
			.from('contract_templates')
			.insert({ name, body: text(formData, 'body') ?? '' })
		if (error) return failWith(error)
		return { success: 'Template added.' }
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error } = await locals.supabase
			.from('contract_templates')
			.update({ name: text(formData, 'name') ?? 'Template', body: text(formData, 'body') ?? '' })
			.eq('id', id(formData))
		if (error) return failWith(error)
		return { success: 'Saved.' }
	},

	delete: async ({ request, locals }) => {
		const { error } = await locals.supabase
			.from('contract_templates')
			.delete()
			.eq('id', id(await request.formData()))
		if (error) return failWith(error)
		return { success: 'Deleted.' }
	}
}

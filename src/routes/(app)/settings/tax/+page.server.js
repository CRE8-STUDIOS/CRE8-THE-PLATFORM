import { error } from '@sveltejs/kit'
import { id, text, number, failMessage, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, parent }) => {
	const { profile } = await parent()
	if (!profile?.is_admin) error(403, 'Only the admin can edit tax rules.')

	const { data: rules } = await locals.supabase
		.from('tax_rules')
		.select('id, year, key, value, description')
		.order('year', { ascending: false })
		.order('key')
	return { rules: rules ?? [], year: new Date().getFullYear() }
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, locals }) => {
		const formData = await request.formData()
		const year = number(formData, 'year')
		const key = text(formData, 'key')
		const value = number(formData, 'value')
		if (!year || !key || value === null) return failMessage('Fill in year, key and value.')

		const { error: saveError } = await locals.supabase
			.from('tax_rules')
			.upsert(
				{ year, key, value, description: text(formData, 'description') },
				{ onConflict: 'year,key' }
			)
		if (saveError) return failWith(saveError)
		return { success: 'Saved.' }
	},

	delete: async ({ request, locals }) => {
		const { error: deleteError } = await locals.supabase
			.from('tax_rules')
			.delete()
			.eq('id', id(await request.formData()))
		if (deleteError) return failWith(deleteError)
		return { success: 'Deleted.' }
	}
}

import { text, number } from '#lib/server/form.js'

export const projectFromForm = (/** @type {FormData} */ formData) => ({
	title: text(formData, 'title') ?? '',
	client_id: text(formData, 'client_id'),
	price_type: /** @type {'fixed' | 'hourly'} */ (
		text(formData, 'price_type') === 'hourly' ? 'hourly' : 'fixed'
	),
	price: number(formData, 'price'),
	start_date: text(formData, 'start_date'),
	deadline: text(formData, 'deadline'),
	color: text(formData, 'color'),
	briefing: text(formData, 'briefing')
})

export const clientOptions = async (/** @type {App.Locals['supabase']} */ supabase) => {
	const { data } = await supabase
		.from('clients')
		.select('id, name')
		.is('archived_at', null)
		.order('name')
	return (data ?? []).map(({ id, name }) => ({ value: id, label: name }))
}

export const projectOptions = async (
	/** @type {App.Locals['supabase']} */ supabase,
	statuses = ['draft', 'active']
) => {
	const { data } = await supabase
		.from('projects')
		.select('id, title')
		.in('status', /** @type {any} */ (statuses))
		.order('title')
	return (data ?? []).map(({ id, title }) => ({ value: id, label: title }))
}

import { text, failMessage, failWith } from '#lib/server/form.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { data: theme } = await locals.supabase
		.from('themes')
		.select('template_name, colors, fonts, layout')
		.maybeSingle()

	// JSON as readable text for the editor
	const pretty = (/** @type {unknown} */ value) => JSON.stringify(value ?? {}, null, 2)
	return {
		theme: {
			templateName: theme?.template_name ?? '',
			colors: pretty(theme?.colors),
			fonts: pretty(theme?.fonts),
			layout: pretty(theme?.layout)
		}
	}
}

/** A JSON object from a text field; undefined when it isn't valid. */
const jsonObject = (/** @type {string | null} */ value) => {
	if (!value) return {}
	try {
		const parsed = JSON.parse(value)
		return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : undefined
	} catch {
		return undefined
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, locals }) => {
		const { supabase } = locals
		const formData = await request.formData()
		const colors = jsonObject(text(formData, 'colors'))
		const fonts = jsonObject(text(formData, 'fonts'))
		const layout = jsonObject(text(formData, 'layout'))
		if (!colors || !fonts || !layout)
			return failMessage(
				'Colours, fonts and layout must be valid JSON objects, e.g. {"primary": "hsl(250 60% 50%)"}'
			)

		const values = { template_name: text(formData, 'template_name'), colors, fonts, layout }
		const { data: existing } = await supabase.from('themes').select('id').maybeSingle()
		const { error } = existing
			? await supabase.from('themes').update(values).eq('id', existing.id)
			: await supabase.from('themes').insert(values)
		if (error) return failWith(error)
		return { success: 'Theme saved.' }
	}
}

import { error } from '@sveltejs/kit'
import { ICON_BUCKET, saveTile } from '#lib/server/workspace.js'
import { ICON_URL_SECONDS } from '#lib/workspace/tiles.js'

/** @param {import('#lib/server/workspace.js').Supabase} supabase */
const findApp = async (supabase, /** @type {string} */ id) => {
	const { data } = await supabase
		.from('dashboard_tiles')
		.select('id, name, url, icon_path')
		.eq('id', id)
		.eq('kind', 'app')
		.maybeSingle()
	if (!data) error(404, 'This app does not exist.')
	return data
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const app = await findApp(locals.supabase, params.id)
	const { data: signed } = app.icon_path
		? await locals.supabase.storage
				.from(ICON_BUCKET)
				.createSignedUrl(app.icon_path, ICON_URL_SECONDS)
		: { data: null }

	return {
		form: {
			kind: /** @type {const} */ ('app'),
			heading: 'Change app',
			submitLabel: 'Save',
			action: `/workspace/apps/${app.id}`,
			closeHref: '/workspace?edit',
			answers: { name: app.name, url: app.url },
			iconUrl: signed?.signedUrl ?? null
		}
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, params }) => {
		if (!locals.user) error(401)
		const app = await findApp(locals.supabase, params.id)
		return saveTile({
			supabase: locals.supabase,
			userId: locals.user.id,
			formData: await request.formData(),
			kind: 'app',
			existing: { id: app.id, icon_path: app.icon_path },
			back: '/workspace?edit'
		})
	}
}

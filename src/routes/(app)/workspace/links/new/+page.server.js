import { error } from '@sveltejs/kit'
import { saveTile } from '#lib/server/workspace.js'

/** @type {import('./$types').PageServerLoad} */
export const load = () => ({
	form: {
		kind: /** @type {const} */ ('link'),
		heading: 'Add a link',
		submitLabel: 'Add link',
		action: '/workspace/links/new',
		closeHref: '/workspace'
	}
})

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) error(401)
		return saveTile({
			supabase: locals.supabase,
			userId: locals.user.id,
			formData: await request.formData(),
			kind: 'link'
		})
	}
}

import { redirect } from '@sveltejs/kit'
import { text, failMessage, failWith } from '#lib/server/form.js'
import { ASSISTANT_NAME_MAX } from '#lib/utils/constants.js'
import { stepHref, stepIndex } from '#lib/utils/onboarding.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, parent, url }) => {
	if (locals.onboarded) return { onboarding: null }

	const { profile, assistant } = await parent()

	return {
		onboarding: {
			step: stepIndex(url.searchParams.get('step')),
			userName: profile?.name ?? null,
			assistant
		}
	}
}

/** @param {FormData} formData @param {string} key */
const nameField = (formData, key) => {
	const value = text(formData, key)
	return value && [...value].length > ASSISTANT_NAME_MAX ? undefined : value
}

/**
 * @param {App.Locals} locals
 * @param {import('#lib/database.types.js').TablesUpdate<'profiles'>} values
 * @param {string} next
 */
const saveAndGo = async (locals, values, next) => {
	const { error } = await locals.supabase
		.from('profiles')
		.update(values)
		.eq('id', locals.user?.id ?? '')
	if (error) return failWith(error)
	redirect(303, next)
}

const TOO_LONG = `Keep it to ${ASSISTANT_NAME_MAX} characters, please.`

/** @type {import('./$types').Actions} */
export const actions = {
	yourName: async ({ request, locals }) => {
		const name = nameField(await request.formData(), 'name')
		if (name === undefined) return failMessage(TOO_LONG)
		return saveAndGo(locals, { name }, stepHref(2))
	},

	myName: async ({ request, locals }) => {
		const formData = await request.formData()
		const pleaded = formData.get('plea') === 'yes'

		if (formData.get('intent') === 'skip') {
			if (!pleaded) return { plea: true }
			return saveAndGo(locals, { assistant_name: null }, stepHref(3))
		}

		const name = nameField(formData, 'assistant_name')
		if (name === undefined) return failMessage(TOO_LONG)
		if (name === null) return { plea: true }
		return saveAndGo(locals, { assistant_name: name }, stepHref(3))
	}
}

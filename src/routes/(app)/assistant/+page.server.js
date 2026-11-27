import { stepIndex } from '#lib/utils/onboarding.js'

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

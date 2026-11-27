export const ONBOARDING_STEPS = [
	{ id: 'hello', label: 'Hello' },
	{ id: 'your-name', label: 'Your name' },
	{ id: 'my-name', label: 'My name' },
	{ id: 'color', label: 'Color' },
	{ id: 'shape', label: 'Shape' },
	{ id: 'transform', label: 'Transform' },
	{ id: 'workspace', label: 'Workspace' },
	{ id: 'done', label: 'Done' }
]

/** @param {string | null} id */
export const stepIndex = (id) =>
	Math.max(
		0,
		ONBOARDING_STEPS.findIndex((step) => step.id === id)
	)

/** @param {number} index */
export const stepHref = (index) =>
	`/assistant?step=${ONBOARDING_STEPS[Math.max(0, Math.min(ONBOARDING_STEPS.length - 1, index))].id}`

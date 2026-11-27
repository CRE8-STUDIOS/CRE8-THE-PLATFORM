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

/** @type {['wash' | 'scream' | 'scared' | 'hmm' | 'poof' | 'ready', number][]} */
export const INTRO = [
	['wash', 0],
	['scream', 3400],
	['scared', 4700],
	['hmm', 6300],
	['poof', 8000],
	['ready', 8800]
]

export const RAMBLE =
	"I'm going to be your right hand. The Robin to your Batman. The Watson to your Sherlock. The cheese to your macaroni. The sprinkles on your donut. The charger to your phone at 2%. The fries to your... the ketchup on your... the"

export const REAL =
	'Sorry. I got carried away. What I actually do: keep your projects, clients, hours, contracts and facturen in one place, and nudge you before anything catches fire.'

/** Costume and the position in the ramble where it goes on */
export const COSTUMES = /** @type {const} */ ([
	['robin', 'The Robin'],
	['sherlock', 'The Watson'],
	['cheese', 'The cheese'],
	['sprinkles', 'The sprinkles'],
	['charger', 'The charger'],
	['fries', 'The fries'],
	['ketchup', 'the ketchup']
]).map(([id, cue]) => /** @type {const} */ ([id, RAMBLE.indexOf(cue)]))

/** @type {Record<string, string>} */
export const COSTUME_FILL = { cheese: '#f5c542', sprinkles: 'var(--mascot-pink)' }

/** @param {string} text @param {number} index */
export const typingPause = (text, index) => {
	const char = text[index - 1]
	const next = text[index]
	if ((char === '.' || char === '?' || char === '!') && next !== '.') return 900
	if (char === ',' || char === ':') return 350
	return 0
}

/** @type {Record<string, { name: string, line: string }>} */
export const COLOR_LINES = {
	ink: { name: 'Ink', line: 'ink. the original. never out of print.' },
	pink: { name: 'Pink', line: 'pink? oh I am SO pink. pink is my love language.' },
	blue: { name: 'Blue', line: 'blue. calm. the exact opposite of your inbox.' },
	green: { name: 'Green', line: 'green. fresh. like I ate a salad. I did not.' },
	orange: { name: 'Orange', line: 'orange. loud. the neighbours will know.' },
	lilac: { name: 'Lilac', line: 'lilac. dramatic. a little extra. same.' }
}

/** @type {Record<string, { name: string, line: string }>} */
export const SHAPE_LINES = {
	splat: { name: 'Splat', line: 'the original splash. a classic never dies.' },
	bubble: { name: 'Bubble', line: 'round, soft, emotionally available.' },
	star: { name: 'Star', line: 'a star. obviously. you saw it too.' },
	cloud: { name: 'Cloud', line: 'fluffy, with a 90% chance of deadlines.' },
	flower: { name: 'Flower', line: 'blooming under pressure. literally.' }
}

/** @type {['before' | 'drum' | 'boom', number][]} */
export const SHOW = [
	['before', 0],
	['drum', 2200],
	['boom', 5200]
]

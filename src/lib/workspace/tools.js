/** "No boards yet", "1 board" or "3 boards" */
export const countText = (
	/** @type {number | null} */ count,
	/** @type {string} */ one,
	/** @type {string} */ many
) => (!count ? `No ${many} yet` : `${count} ${count === 1 ? one : many}`)

/**
 * The three tools on the workspace. The whiteboard does not exist yet.
 * @param {{ moodboards: number | null, notes: number | null }} counts
 */
export const workspaceTools = ({ moodboards, notes }) => [
	{
		name: 'Moodboard',
		line: 'Images, colours and references',
		count: countText(moodboards, 'board', 'boards'),
		href: '/moodboards'
	},
	{
		name: 'Notes',
		line: 'Ideas, briefs and to remember',
		count: countText(notes, 'note', 'notes'),
		href: '/notes'
	},
	{ name: 'Whiteboard', line: 'Sketch, map and mind map', count: 'Coming soon', href: null }
]

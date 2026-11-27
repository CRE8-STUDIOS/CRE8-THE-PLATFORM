/** Seconds a signed icon url stays valid */
export const ICON_URL_SECONDS = 300

/** The letter shown when a tile has no icon */
export const initialOf = (/** @type {string} */ name) =>
	name
		.replace(/[^\p{L}\p{N}]/gu, '')
		.charAt(0)
		.toUpperCase()

/** "belastingdienst.nl" from "https://www.belastingdienst.nl/btw" */
export const domainOf = (/** @type {string} */ url) => {
	try {
		return new URL(url).hostname.replace(/^www\./, '')
	} catch {
		return url
	}
}

/** Icon files we accept, with the extension they are saved under */
export const ICON_TYPES = /** @type {Record<string, string>} */ ({
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
	'image/svg+xml': 'svg'
})

export const ICON_ACCEPT = Object.keys(ICON_TYPES).join(',')

/** 1 MB, the same as the bucket limit */
export const ICON_MAX_BYTES = 1024 * 1024

/**
 * Turns what the user typed into a link: a bare domain gets https://.
 * Returns null when it is not a web address.
 * @param {string} input
 */
export const normalizeUrl = (input) => {
	const value = input.trim()
	if (!value) return null
	const withScheme = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`
	try {
		const url = new URL(withScheme)
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
		if (!url.hostname.includes('.') && url.hostname !== 'localhost') return null
		return url.href
	} catch {
		return null
	}
}

/**
 * Checks the name and link of an app or link.
 * @param {{ name: string, url: string }} input
 * @param {'app' | 'link'} kind
 */
export const validateTile = ({ name, url }, kind) => {
	/** @type {Record<string, string>} */
	const errors = {}
	const cleanName = name.trim()
	if (!cleanName) errors.name = kind === 'app' ? 'Give the app a name.' : 'Say what it is.'
	else if (cleanName.length > 60) errors.name = 'Keep it under 60 characters.'
	const cleanUrl = normalizeUrl(url)
	if (!url.trim()) errors.url = 'Paste the link.'
	else if (!cleanUrl) errors.url = 'This does not look like a web address.'
	return { values: { name: cleanName, url: cleanUrl ?? '' }, errors }
}

/**
 * Checks an icon file before it is read.
 * @param {{ type: string, size: number }} file
 */
export const iconError = (file) => {
	if (!ICON_TYPES[file.type]) return 'Use a PNG, JPG, SVG or WEBP file.'
	if (file.size > ICON_MAX_BYTES) return 'The icon can be 1 MB at most.'
	return null
}

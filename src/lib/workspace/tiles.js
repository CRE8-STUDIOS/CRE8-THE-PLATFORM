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

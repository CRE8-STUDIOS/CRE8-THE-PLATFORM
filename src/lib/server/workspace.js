import { ICON_URL_SECONDS, domainOf } from '#lib/workspace/tiles.js'

export const ICON_BUCKET = 'tile-icons'

/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} Supabase
 * @typedef {{ id: string, name: string, url: string, iconUrl: string | null, position: number }} App
 * @typedef {{ id: string, name: string, url: string, domain: string, position: number }} Link
 */

/**
 * Apps and links of the workspace in their order, icons as short signed urls.
 * @param {Supabase} supabase
 */
export const loadTiles = async (supabase) => {
	const { data } = await supabase
		.from('dashboard_tiles')
		.select('id, name, url, icon_path, position, kind')
		.order('position')
		.order('created_at')
	const rows = data ?? []

	const paths = rows.flatMap((row) => (row.kind === 'app' && row.icon_path ? [row.icon_path] : []))
	/** @type {Record<string, string>} */
	const urls = {}
	if (paths.length) {
		const { data: signed } = await supabase.storage
			.from(ICON_BUCKET)
			.createSignedUrls(paths, ICON_URL_SECONDS)
		for (const { path, signedUrl } of signed ?? []) if (path && signedUrl) urls[path] = signedUrl
	}

	return {
		/** @type {App[]} */
		apps: rows
			.filter((row) => row.kind === 'app')
			.map(({ id, name, url, icon_path, position }) => ({
				id,
				name,
				url,
				position,
				iconUrl: icon_path ? (urls[icon_path] ?? null) : null
			})),
		/** @type {Link[]} */
		links: rows
			.filter((row) => row.kind === 'link')
			.map(({ id, name, url, position }) => ({ id, name, url, position, domain: domainOf(url) }))
	}
}

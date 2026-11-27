import { fail, redirect } from '@sveltejs/kit'
import sharp from 'sharp'
import {
	ICON_TYPES,
	ICON_URL_SECONDS,
	domainOf,
	iconError,
	validateTile
} from '#lib/workspace/tiles.js'

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

/** Raster formats sharp reports for each accepted type */
const SHARP_FORMATS = /** @type {Record<string, string>} */ ({
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/webp': 'webp'
})

/**
 * Reads an uploaded icon and makes it safe to show. An SVG is drawn to a
 * PNG, so no script inside it can ever run. Other files have to really be
 * the image type they claim to be.
 * @param {File} file
 * @returns {Promise<{ body: Uint8Array | ArrayBuffer, type: string, ext: string } | { error: string }>}
 */
export const readIcon = async (file) => {
	const problem = iconError(file)
	if (problem) return { error: problem }
	const bytes = await file.arrayBuffer()
	try {
		if (file.type === 'image/svg+xml') {
			const png = await sharp(new Uint8Array(bytes), { density: 300 })
				.resize(256, 256, { fit: 'inside' })
				.png()
				.toBuffer()
			return { body: png, type: 'image/png', ext: 'png' }
		}
		const { format } = await sharp(new Uint8Array(bytes)).metadata()
		if (format !== SHARP_FORMATS[file.type]) return { error: 'This file is not a real image.' }
		return { body: bytes, type: file.type, ext: ICON_TYPES[file.type] }
	} catch {
		return { error: 'This image could not be read. Try another file.' }
	}
}

/**
 * Removes icon files, ignoring empty paths.
 * @param {Supabase} supabase
 * @param {(string | null | undefined)[]} paths
 */
export const removeIcons = async (supabase, paths) => {
	const existing = /** @type {string[]} */ (paths.filter(Boolean))
	if (existing.length) await supabase.storage.from(ICON_BUCKET).remove(existing)
}

/** The first position after the last tile of a kind */
const nextPosition = async (
	/** @type {Supabase} */ supabase,
	/** @type {'app' | 'link'} */ kind
) => {
	const { data } = await supabase
		.from('dashboard_tiles')
		.select('position')
		.eq('kind', kind)
		.order('position', { ascending: false })
		.limit(1)
		.maybeSingle()
	return data ? data.position + 1 : 0
}

/**
 * Adds or changes an app or link from a form. A new icon replaces the old
 * one, the old file is removed after the row is saved.
 * @param {{
 *   supabase: Supabase,
 *   userId: string,
 *   formData: FormData,
 *   kind: 'app' | 'link',
 *   existing?: { id: string, icon_path: string | null } | null,
 *   back?: string
 * }} input
 */
export const saveTile = async ({
	supabase,
	userId,
	formData,
	kind,
	existing = null,
	back = '/workspace'
}) => {
	const answers = {
		name: String(formData.get('name') ?? ''),
		url: String(formData.get('url') ?? '')
	}
	const { values, errors } = validateTile(answers, kind)

	const icon = kind === 'app' ? formData.get('icon') : null
	const upload = icon instanceof File && icon.size > 0 ? await readIcon(icon) : null
	if (upload && 'error' in upload) errors.icon = upload.error
	if (Object.keys(errors).length) return fail(400, { errors, answers })

	let iconPath = existing?.icon_path ?? null
	if (upload && !('error' in upload)) {
		iconPath = `${userId}/${crypto.randomUUID()}.${upload.ext}`
		const { error } = await supabase.storage
			.from(ICON_BUCKET)
			.upload(iconPath, upload.body, { contentType: upload.type })
		if (error)
			return fail(400, { errors: { form: 'The icon could not be saved. Try again.' }, answers })
	}

	const { error } = existing
		? await supabase
				.from('dashboard_tiles')
				.update({ ...values, icon_path: iconPath })
				.eq('id', existing.id)
		: await supabase.from('dashboard_tiles').insert({
				...values,
				kind,
				icon_path: iconPath,
				position: await nextPosition(supabase, kind)
			})
	if (error) {
		if (iconPath !== (existing?.icon_path ?? null)) await removeIcons(supabase, [iconPath])
		return fail(400, { errors: { form: 'This could not be saved. Try again.' }, answers })
	}
	if (existing && iconPath !== existing.icon_path) await removeIcons(supabase, [existing.icon_path])

	redirect(303, back)
}

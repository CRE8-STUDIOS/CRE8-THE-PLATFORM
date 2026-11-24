import { fail } from '@sveltejs/kit'

// Helpers to read form fields in actions. Server-only (this folder is called "server").

/** Text field: trimmed string, or null when empty. */
export const text = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = formData.get(key)
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

/** Required id field (hidden input). */
export const id = (/** @type {FormData} */ formData, key = 'id') => text(formData, key) ?? ''

/** Number field (accepts a comma as decimal sign), or null when empty. */
export const number = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = text(formData, key)
	if (value === null) return null
	const parsed = Number(value.replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

/** Checkbox field. */
export const checkbox = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = formData.get(key)
	return value === 'on' || value === 'true' || value === '1'
}

/** Uploaded file, or null when no file was chosen. */
export const file = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = formData.get(key)
	return value instanceof File && value.size > 0 ? value : null
}

/** A value that must be one of a fixed list (database enum), otherwise the fallback. */
export const oneOf = (
	/** @type {string | null} */ value,
	/** @type {readonly string[]} */ allowed,
	/** @type {string} */ fallback
) => /** @type {any} */ (value !== null && allowed.includes(value) ? value : fallback)

/** Turn an error into a form failure the page can show. */
export const failWith = (/** @type {{ message: string } | null} */ error, extra = {}) =>
	fail(400, { message: error?.message ?? 'Something went wrong.', ...extra })

/** Fail with a plain message. */
export const failMessage = (/** @type {string} */ message, extra = {}) =>
	fail(400, { message, ...extra })

/** Only allow redirects inside this app (no //evil.com). */
export const safeRedirect = (/** @type {string | null} */ to, fallback = '/') =>
	to && to.startsWith('/') && !to.startsWith('//') ? to : fallback

/** Storage path inside the user's own folder: <user_id>/<...folders>/<timestamp>-<name> */
export const storagePath = (
	/** @type {string} */ userId,
	/** @type {string[]} */ folders,
	/** @type {string} */ fileName
) => {
	const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-120)
	return [userId, ...folders, `${Date.now()}-${safeName}`].join('/')
}

/** Temporary download links for files in a storage bucket, keyed by path. */
export const signedUrls = async (
	/** @type {import('@supabase/supabase-js').SupabaseClient} */ supabase,
	/** @type {string} */ bucket,
	/** @type {(string | null)[]} */ paths
) => {
	/** @type {Record<string, string>} */
	const urls = {}
	const existing = /** @type {string[]} */ (paths.filter(Boolean))
	if (!existing.length) return urls

	const { data } = await supabase.storage.from(bucket).createSignedUrls(existing, 3600)
	for (const { path, signedUrl } of data ?? []) if (path && signedUrl) urls[path] = signedUrl
	return urls
}

import { fail } from '@sveltejs/kit'

export const text = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = formData.get(key)
	return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

export const id = (/** @type {FormData} */ formData, key = 'id') => text(formData, key) ?? ''

export const number = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = text(formData, key)
	if (value === null) return null
	const parsed = Number(value.replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

export const checkbox = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = formData.get(key)
	return value === 'on' || value === 'true' || value === '1'
}

export const file = (/** @type {FormData} */ formData, /** @type {string} */ key) => {
	const value = formData.get(key)
	return value instanceof File && value.size > 0 ? value : null
}

export const oneOf = (
	/** @type {string | null} */ value,
	/** @type {readonly string[]} */ allowed,
	/** @type {string} */ fallback
) => /** @type {any} */ (value !== null && allowed.includes(value) ? value : fallback)

export const failWith = (/** @type {{ message: string } | null} */ error, extra = {}) =>
	fail(400, { message: error?.message ?? 'Something went wrong.', ...extra })

export const failMessage = (/** @type {string} */ message, extra = {}) =>
	fail(400, { message, ...extra })

export const safeRedirect = (/** @type {string | null} */ to, fallback = '/') =>
	to && to.startsWith('/') && !to.startsWith('//') ? to : fallback

export const storagePath = (
	/** @type {string} */ userId,
	/** @type {string[]} */ folders,
	/** @type {string} */ fileName
) => {
	const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-120)
	return [userId, ...folders, `${Date.now()}-${safeName}`].join('/')
}

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

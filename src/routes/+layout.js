import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$app/env/public'

/**
 * A Supabase client for the browser (used for things like the clock heartbeat).
 * Most data goes through the server (+page.server.js files).
 * @type {import('./$types').LayoutLoad}
 */
export const load = async ({ data, depends, fetch }) => {
	depends('supabase:auth')

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} */
	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: { fetch }
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global: { fetch },
				cookies: { getAll: () => data.cookies }
			})

	return { ...data, supabase }
}

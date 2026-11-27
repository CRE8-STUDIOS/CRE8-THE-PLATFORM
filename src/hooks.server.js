import { createServerClient } from '@supabase/ssr'
import { redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$app/env/public'

const PUBLIC_ROUTES = new Set([
	'/',
	'/login',
	'/login/form',
	'/login/forgot',
	'/login/reset',
	'/signup',
	'/portal/signup',
	'/auth/callback',
	'/logout'
])

const GUEST_ROUTES = new Set([
	'/login',
	'/login/form',
	'/login/forgot',
	'/signup',
	'/portal/signup'
])

/** @type {import('@sveltejs/kit/hooks').Handle} */
const supabase = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet, headers) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' })
				}
				if (headers && Object.keys(headers).length > 0) event.setHeaders(headers)
			}
		}
	})

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	})
}

/** @type {import('@sveltejs/kit/hooks').Handle} */
const identify = async ({ event, resolve }) => {
	const { supabase } = event.locals
	event.locals.user = null
	event.locals.role = null
	event.locals.timezone = 'Europe/Amsterdam'

	const { data, error } = await supabase.auth.getClaims()
	const claims = error ? null : data?.claims

	if (claims) {
		event.locals.user = { id: claims.sub, email: claims.email ?? null }

		const [{ data: profile }, { data: account }] = await Promise.all([
			supabase.from('profiles').select('id, timezone').eq('id', claims.sub).maybeSingle(),
			supabase.from('client_accounts').select('id').eq('auth_user_id', claims.sub).maybeSingle()
		])

		if (profile) {
			event.locals.role = 'freelancer'
			event.locals.timezone = profile.timezone
		} else if (account) {
			event.locals.role = 'client'
		}
	}

	return resolve(event)
}

/** @type {import('@sveltejs/kit/hooks').Handle} */
const guard = async ({ event, resolve }) => {
	const routeId = event.route.id
	const { user, role } = event.locals

	if (!routeId) return resolve(event)

	const home = role === 'client' ? '/portal' : '/overview'

	if (role && GUEST_ROUTES.has(routeId)) redirect(303, home)
	if (PUBLIC_ROUTES.has(routeId)) return resolve(event)

	if (!user || !role) {
		const redirectTo = encodeURIComponent(event.url.pathname + event.url.search)
		redirect(303, `/login?redirectTo=${redirectTo}`)
	}

	const isPortal = routeId.startsWith('/portal/(client)')
	const isApp = routeId.startsWith('/(app)')

	if (isPortal && role !== 'client') redirect(303, '/overview')
	if (isApp && role !== 'freelancer') redirect(303, '/portal')

	return resolve(event)
}

export const handle = sequence(supabase, identify, guard)

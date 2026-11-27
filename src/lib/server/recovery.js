const RECOVERY_COOKIE = 'recovery_pending'

/** @param {import('@sveltejs/kit').Cookies} cookies */
export const startRecovery = (cookies) =>
	cookies.set(RECOVERY_COOKIE, '1', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 15
	})

/** @param {import('@sveltejs/kit').Cookies} cookies @param {App.Locals['user']} user */
export const inRecovery = (cookies, user) => Boolean(user) && cookies.get(RECOVERY_COOKIE) === '1'

/** @param {import('@sveltejs/kit').Cookies} cookies */
export const endRecovery = (cookies) => cookies.delete(RECOVERY_COOKIE, { path: '/' })

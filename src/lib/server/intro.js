const INTRO_COOKIE = 'intro_seen'

/** @param {import('@sveltejs/kit').Cookies} cookies @param {string} today */
export const introSeenToday = (cookies, today) => cookies.get(INTRO_COOKIE) === today

/** @param {import('@sveltejs/kit').Cookies} cookies @param {string} today */
export const markIntroSeen = (cookies, today) =>
	cookies.set(INTRO_COOKIE, today, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 48
	})

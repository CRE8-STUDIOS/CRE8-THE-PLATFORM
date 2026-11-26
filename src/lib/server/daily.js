export const INTRO_SEEN = 'intro_seen'
export const CLOCK_IN_LATER = 'clock_in_later'

/** @param {import('@sveltejs/kit').Cookies} cookies @param {string} name @param {string} today */
export const isSetToday = (cookies, name, today) => cookies.get(name) === today

/** @param {import('@sveltejs/kit').Cookies} cookies @param {string} name @param {string} today */
export const setForToday = (cookies, name, today) =>
	cookies.set(name, today, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 48
	})

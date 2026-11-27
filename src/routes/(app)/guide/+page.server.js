import { appTour, moneyLessons } from '#lib/guide/content.js'
import { trackProgress } from '#lib/guide/progress.js'
import { loadProgress, loadRules, searchIndex, withRules } from '#lib/server/guide.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, url }) => {
	const { supabase, user } = locals
	const [{ rules }, appRows, moneyRows, { data: profile }] = await Promise.all([
		loadRules(supabase),
		loadProgress(supabase, 'app'),
		loadProgress(supabase, 'money'),
		supabase
			.from('profiles')
			.select('name')
			.eq('id', user?.id ?? '')
			.maybeSingle()
	])
	const app = trackProgress(appTour, appRows)
	const money = trackProgress(withRules(moneyLessons, rules), moneyRows)

	const first = profile?.name?.trim().split(/\s+/)[0]

	return {
		firstName: first ? first.charAt(0).toUpperCase() + first.slice(1) : null,
		tracks: [
			{
				href: app.next ? `/guide/app/${app.next.slug}` : '/guide/app',
				title: 'How CRE8 works',
				line: 'A tour through the app. I walk you past every page and show what it does.',
				done: app.done,
				total: app.total,
				next: app.next?.title ?? null
			},
			{
				href: '/guide/money',
				title: 'Money basics',
				line: 'For starting creatives who know nothing about money yet. Eenmanszaak or bv, KVK, btw, invoices, taxes. Step by step.',
				done: money.done,
				total: money.total,
				next: money.next?.title ?? null
			}
		],
		entries: searchIndex(rules),
		query: url.searchParams.get('q') ?? ''
	}
}

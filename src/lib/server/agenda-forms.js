import { fail, redirect } from '@sveltejs/kit'
import { answersToItem, readAnswers, readExtras } from '#lib/agenda/answers.js'
import { describeAdd, findErrandSlot, SEARCH_DAYS } from '#lib/agenda/fit.js'
import { loadAgendaRange } from '#lib/server/agenda.js'
import { addDays, todayIn } from '#lib/utils/dates.js'

/** Cookie that carries the "added" sentence to the next page, once */
export const ADDED_COOKIE = 'agenda_added'

/**
 * @typedef {import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>} Supabase
 */

/**
 * Everything the fit sentence needs: items around the day and working hours.
 * @param {Supabase} supabase
 * @param {string} timeZone
 * @param {string} [day] a day to include besides the coming week
 */
export const loadFitContext = async (supabase, timeZone, day) => {
	const today = todayIn(timeZone)
	const from = day && day < today ? day : today
	const to = addDays(day && day >= addDays(today, SEARCH_DAYS) ? day : today, SEARCH_DAYS)
	const [items, { data: workingHours }] = await Promise.all([
		loadAgendaRange(supabase, from, to, timeZone),
		supabase.from('working_hours').select('weekday, starts_at, ends_at')
	])
	return {
		today,
		now: new Date().toISOString(),
		timeZone,
		items,
		workingHours: (workingHours ?? []).map((row) => ({
			weekday: row.weekday,
			starts_at: row.starts_at.slice(0, 5),
			ends_at: row.ends_at.slice(0, 5)
		}))
	}
}

/**
 * Validates and maps the answers. For "find a time for me" errands the free
 * moment is looked up first, so the item is saved with a real time.
 * @param {string} type
 * @param {Record<string, string>} answers
 * @param {Awaited<ReturnType<typeof loadFitContext>>} context
 */
export const prepareItem = (type, answers, context) => {
	const sentence = describeAdd(type, answers, context)
	let resolved = answers
	if (type === 'errand' && answers.timing !== 'pick' && answers.opens && answers.closes) {
		const slot = findErrandSlot(
			{ opens: answers.opens, closes: answers.closes, minutes: Number(answers.duration) || 30 },
			context
		)
		if (slot)
			resolved = { ...answers, timing: 'pick', day: 'pick', date: slot.day, from: slot.from }
	}
	const { values, errors } = answersToItem(type, resolved, context)
	return { values, errors, sentence }
}

/**
 * Saves the checklist and people that came with the extra options.
 * @param {Supabase} supabase
 * @param {string} itemId
 * @param {FormData} formData
 */
export const saveExtras = async (supabase, itemId, formData) => {
	const { checklist, people } = readExtras(formData)
	const [checks, persons] = await Promise.all([
		checklist.length
			? supabase
					.from('agenda_checklist_items')
					.insert(checklist.map((label, position) => ({ agenda_item_id: itemId, label, position })))
			: { error: null },
		people.length
			? supabase
					.from('agenda_people')
					.insert(people.map((person) => ({ ...person, agenda_item_id: itemId })))
			: { error: null }
	])
	return checks.error ?? persons.error
}

/** The local day an item lands on, to show it after saving */
const landingDay = (
	/** @type {Record<string, unknown>} */ values,
	/** @type {string} */ timeZone
) =>
	typeof values.starts_at === 'string'
		? todayIn(timeZone, new Date(values.starts_at))
		: typeof values.due_date === 'string'
			? values.due_date
			: todayIn(timeZone)

/**
 * The form action for one type: validate, save, and go to the day it landed on.
 * @param {string} type
 * @returns {import('@sveltejs/kit').Action}
 */
export const addAction =
	(type) =>
	async ({ request, locals, cookies }) => {
		const formData = await request.formData()
		const answers = readAnswers(formData)
		const context = await loadFitContext(locals.supabase, locals.timezone, answers.date)
		const { values, errors, sentence } = prepareItem(type, answers, context)
		if (Object.keys(errors).length) return fail(400, { errors, answers, sentence })

		const { data, error } = await locals.supabase
			.from('agenda_items')
			.insert(/** @type {any} */ (values))
			.select('id')
			.single()
		if (error) return fail(400, { errors: { form: error.message }, answers, sentence })

		const extrasError = await saveExtras(locals.supabase, data.id, formData)
		if (extrasError) return fail(400, { errors: { form: extrasError.message }, answers, sentence })

		cookies.set(ADDED_COOKIE, sentence, {
			path: '/agenda',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60
		})
		redirect(303, `/agenda?date=${landingDay(values, locals.timezone)}`)
	}

/**
 * Reads and clears the "added" sentence.
 * @param {import('@sveltejs/kit').Cookies} cookies
 */
export const takeAddedSentence = (cookies) => {
	const sentence = cookies.get(ADDED_COOKIE) ?? null
	if (sentence) cookies.delete(ADDED_COOKIE, { path: '/agenda' })
	return sentence
}

import { appTour } from './content.js'

/**
 * @typedef {{ target: string, text: string }} TourStep
 * @typedef {{ slug: string, title: string, page: string, steps: TourStep[] }} Chapter
 */

/** The chapter with this slug, or null */
export const findChapter = (/** @type {string | null} */ slug) =>
	/** @type {Chapter | undefined} */ (appTour.find((chapter) => chapter.slug === slug)) ?? null

/** The first chapter that can be shown on the real page; the morning only happens in the morning */
const FIRST_IN_APP = 'agenda'

/** True when a chapter can be shown on the real page */
export const showsInApp = (/** @type {Chapter} */ chapter) =>
	appTour.findIndex((item) => item.slug === chapter.slug) >=
	appTour.findIndex((item) => item.slug === FIRST_IN_APP)

/** The link that shows a tour step on the real page */
export const inAppHref = (/** @type {Chapter} */ chapter, /** @type {number} */ step) =>
	`${chapter.page}?tour=${chapter.slug}&step=${step}`

/**
 * One step of the tour with the way back and forward. Past the last step
 * of a chapter it goes on to the next chapter.
 * @param {Chapter} chapter
 * @param {number} wanted
 */
export const tourStep = (chapter, wanted) => {
	const index = appTour.findIndex((item) => item.slug === chapter.slug)
	const step = Number.isInteger(wanted) && wanted >= 0 && wanted < chapter.steps.length ? wanted : 0
	const previousChapter = /** @type {Chapter | undefined} */ (appTour[index - 1])
	const nextChapter = /** @type {Chapter | undefined} */ (appTour[index + 1])
	const last = step === chapter.steps.length - 1

	return {
		chapter: { slug: chapter.slug, title: chapter.title, page: chapter.page, number: index + 1 },
		chapters: appTour.length,
		step,
		steps: chapter.steps.length,
		current: chapter.steps[step],
		last,
		/** Where BACK goes in the guide */
		back:
			step > 0
				? `/guide/app/${chapter.slug}?step=${step - 1}`
				: previousChapter
					? `/guide/app/${previousChapter.slug}?step=${previousChapter.steps.length - 1}`
					: null,
		/** The next chapter, after the last step of this one */
		nextChapter: last && nextChapter ? { slug: nextChapter.slug, title: nextChapter.title } : null,
		/** The same step, and its neighbours, on the real page */
		inApp: !showsInApp(chapter)
			? null
			: {
					here: inAppHref(chapter, step),
					back: step > 0 ? inAppHref(chapter, step - 1) : null,
					next: !last
						? inAppHref(chapter, step + 1)
						: nextChapter
							? inAppHref(nextChapter, 0)
							: null
				}
	}
}

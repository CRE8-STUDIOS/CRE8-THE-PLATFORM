/**
 * @typedef {{ label: string, next: number, feedback?: string, action?: { setBusinessType?: string } }} Option
 * @typedef {{ bot: string[], options: Option[] }} Step
 * @typedef {{ slug: string, title: string, summary: string, minutes: number, steps: Step[], done: { title: string, line: string, cta: { label: string, href: string } } }} Lesson
 */

/** A saved step that still exists in the lesson */
export const clampStep = (/** @type {Lesson} */ lesson, /** @type {number} */ step) =>
	Number.isInteger(step) && step >= 0 && step < lesson.steps.length ? step : 0

/** The last step has no answers, only FINISH LESSON */
export const isLastStep = (/** @type {Lesson} */ lesson, /** @type {number} */ step) =>
	!lesson.steps[step]?.options.length

/**
 * What an answer does: a wrong quiz answer gives feedback and stays, a
 * right one moves on, sometimes with an action. Null for an unknown answer.
 * @param {Lesson} lesson
 * @param {number} step
 * @param {number} index
 */
export const answer = (lesson, step, index) => {
	const option = lesson.steps[step]?.options[index]
	if (!option) return null
	if (option.feedback)
		return { stay: true, next: step, feedback: option.feedback, label: option.label }
	return {
		stay: false,
		next: clampStep(lesson, option.next),
		feedback: null,
		label: option.label,
		businessType: option.action?.setBusinessType ?? null
	}
}

/**
 * The conversation so far, to show again when someone comes back: the
 * lines of every earlier step and the answer that moved on. When more
 * answers lead on, it is unknown which one was tapped, so none is shown.
 * @param {Lesson} lesson
 * @param {number} step
 */
export const transcript = (lesson, step) =>
	lesson.steps.slice(0, step).map((item, index) => {
		const forward = item.options.filter((option) => !option.feedback)
		return { step: index, bot: item.bot, me: forward.length === 1 ? forward[0].label : null }
	})

export const prefersCalm = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Plays named phases at fixed times. Starts on the last phase, so the page
 * shows the end state when JavaScript does not run or motion is reduced.
 * @template {string} T
 */
export class Timeline {
	started = $state(false)
	/** @type {ReturnType<typeof setTimeout>[]} */
	#timers = []
	/** @type {[T, number][]} */
	#steps

	/** @param {[T, number][]} steps */
	constructor(steps) {
		this.#steps = steps
		/** @type {T} */
		this.phase = $state(steps[steps.length - 1][0])
	}

	play() {
		this.stop()
		this.started = true
		if (prefersCalm()) {
			this.phase = this.#steps[this.#steps.length - 1][0]
			return
		}
		this.phase = this.#steps[0][0]
		for (const [phase, ms] of this.#steps.slice(1)) {
			this.#timers.push(setTimeout(() => (this.phase = phase), ms))
		}
	}

	stop() {
		for (const timer of this.#timers) clearTimeout(timer)
		this.#timers = []
	}
}

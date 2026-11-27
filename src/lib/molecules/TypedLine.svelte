<script>
	import { untrack } from 'svelte'
	import { browser } from '$app/env'
	import { prefersCalm } from '#lib/utils/timeline.svelte.js'
	import { typingPause } from '#lib/utils/onboarding.js'
	import { sounds } from '#lib/utils/sound.js'

	/**
	 * Types a line letter by letter. Screen readers get the whole line once.
	 * Without JavaScript or with reduced motion the full line shows at once.
	 * @type {{ text: string, speed?: number, class?: string }}
	 */
	const { text, speed = 45, class: extra } = $props()

	let typed = $state(untrack(() => (browser ? '' : text)))

	$effect(() => {
		const line = text
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let timer
		untrack(() => {
			if (prefersCalm()) {
				typed = line
				return
			}
			const step = (/** @type {number} */ count) => {
				typed = line.slice(0, count)
				if (count > 0 && line[count - 1] !== ' ') sounds.tick()
				if (count < line.length)
					timer = setTimeout(() => step(count + 1), speed + typingPause(line, count))
			}
			step(0)
		})
		return () => clearTimeout(timer)
	})
</script>

<p class={extra}>
	<span aria-hidden="true">{typed}</span>
	<span class="visually-hidden" role="status">{text}</span>
</p>

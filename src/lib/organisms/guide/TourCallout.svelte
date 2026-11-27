<script>
	import { tick } from 'svelte'
	import { page } from '$app/state'
	import Mascot from '#lib/atoms/Mascot.svelte'

	/**
	 * A step of the app tour on the real page: a small outlined callout next
	 * to the element with the matching data-tour attribute. Without
	 * JavaScript, or when that element is not on the page, it stays at the
	 * top of the page.
	 * @type {{
	 *   tour: ReturnType<typeof import('#lib/guide/tour.js').tourStep>,
	 *   inApp: NonNullable<ReturnType<typeof import('#lib/guide/tour.js').tourStep>['inApp']>
	 * }}
	 */
	const { tour, inApp } = $props()

	/** @type {HTMLElement | undefined} */
	let callout = $state()
	/** @type {{ top: number, left: number } | null} */
	let position = $state(null)
	/** Taken out of the page flow before measuring, so nothing shifts after */
	let floating = $state(false)

	const end = $derived(page.url.pathname)

	const place = (/** @type {HTMLElement} */ target) => {
		if (!callout) return
		const parent = /** @type {HTMLElement} */ (callout.offsetParent ?? document.body)
		const box = target.getBoundingClientRect()
		const frame = parent.getBoundingClientRect()
		const width = callout.offsetWidth
		const left = Math.min(
			Math.max(box.left - frame.left, 16),
			Math.max(parent.clientWidth - width - 16, 16)
		)
		position = { top: box.bottom - frame.top + 12, left }
	}

	$effect(() => {
		const target = /** @type {HTMLElement | null} */ (
			document.querySelector(`[data-tour="${tour.current.target}"]`)
		)
		const visible = target && target.getBoundingClientRect().height > 0
		position = null
		floating = false
		if (!target || !visible) {
			tick().then(() => callout?.focus())
			return
		}
		target.setAttribute('data-tour-active', '')
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
		floating = true
		tick().then(() => {
			place(target)
			target.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
			callout?.focus({ preventScroll: true })
		})
		const onResize = () => place(target)
		addEventListener('resize', onResize)
		return () => {
			removeEventListener('resize', onResize)
			target.removeAttribute('data-tour-active')
		}
	})
</script>

<aside
	bind:this={callout}
	class="tour-callout"
	class:is-placed={floating}
	class:is-hidden={floating && !position}
	style:top={position ? `${position.top}px` : null}
	style:left={position ? `${position.left}px` : null}
	aria-labelledby="tour-callout-heading"
	tabindex="-1"
>
	<div class="tour-callout-top">
		<span class="tour-callout-face" aria-hidden="true"><Mascot size="2rem" animate={false} /></span>
		<h2 id="tour-callout-heading">
			{tour.chapter.title} <span>{tour.step + 1} of {tour.steps}</span>
		</h2>
	</div>
	<p>{tour.current.text}</p>
	<div class="tour-callout-actions">
		{#if inApp.back}<a href={inApp.back}>‹ Back</a>{/if}
		{#if inApp.next}
			<a class="is-strong" href={inApp.next}>
				{tour.last && tour.nextChapter ? `Next: ${tour.nextChapter.title}` : 'Next'}
			</a>
		{:else}
			<a class="is-strong" href="/guide">Back to the guide</a>
		{/if}
		<a href="/guide/app/{tour.chapter.slug}?step={tour.step}">To the guide</a>
		<a href={end}>End tour</a>
	</div>
</aside>

<style>
	.tour-callout {
		z-index: 5;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		box-sizing: border-box;
		inline-size: min(22rem, calc(100% - 2rem));
		padding: var(--space-s) var(--space-m);
		border: var(--line);
		border-radius: 1.125rem;
		background-color: var(--color-background);
		color: var(--color-text);
	}

	.tour-callout.is-placed {
		position: absolute;
	}

	.tour-callout.is-hidden {
		visibility: hidden;
	}

	.tour-callout:focus-visible {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}

	.tour-callout-top {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.tour-callout-face {
		display: flex;
	}

	h2 {
		font-size: var(--font-size-agenda-meta);
		text-transform: uppercase;
	}

	h2 span {
		color: var(--color-text-calm);
		font-weight: 500;
	}

	p {
		font-size: var(--font-size-agenda-meta);
		font-weight: 600;
		line-height: 1.5;
	}

	.tour-callout-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-s);
	}

	.tour-callout-actions a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.tour-callout-actions a.is-strong {
		color: var(--color-text);
	}

	:global([data-tour-active]) {
		outline: var(--line-width) dashed var(--line-color);
		outline-offset: 0.375rem;
		border-radius: var(--radius-item-small);
	}
</style>

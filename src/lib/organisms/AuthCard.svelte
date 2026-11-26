<script module>
	let arriving = false
</script>

<script>
	import { onNavigate } from '$app/navigation'
	import Mascot from '#lib/atoms/Mascot.svelte'
	import EraserWipe from '#lib/atoms/EraserWipe.svelte'

	/** @type {{ title: string, intro?: string, alarm?: boolean, compact?: boolean, children: import('svelte').Snippet, bottom?: import('svelte').Snippet, after?: import('svelte').Snippet }} */
	const { title, intro, alarm = false, compact = false, children, bottom, after } = $props()

	/** @typedef {'idle' | 'look-right' | 'look-left' | 'shock' | 'duck' | 'erase' | 'naked' | 'draw' | 'jump'} Phase */
	/** @type {Phase} */
	let phase = $state(arriving ? 'naked' : 'idle')
	/** @type {{ x: number, y: number } | null} */
	let gaze = $state(null)
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let searching

	const shocked = $derived(['shock', 'duck', 'erase', 'naked', 'draw'].includes(phase))
	const naked = $derived(['naked', 'draw', 'jump'].includes(phase))

	const duration = (/** @type {string} */ name) =>
		parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0
	const wait = (/** @type {number} */ ms) => new Promise((done) => setTimeout(done, ms))

	const startSearching = () => {
		let side = 1
		gaze = { x: side * 0.55, y: -0.2 }
		searching = setInterval(() => {
			side *= -1
			gaze = { x: side * 0.55, y: -0.2 }
		}, duration('--duration-auth-look'))
	}

	const stopSearching = () => {
		clearInterval(searching)
		gaze = null
	}

	$effect(() => {
		if (!arriving) return
		arriving = false
		startSearching()
		wait(duration('--duration-auth-naked') * 0.4)
			.then(() => {
				phase = 'draw'
				return wait(duration('--duration-auth-draw'))
			})
			.then(() => {
				stopSearching()
				phase = 'jump'
			})
		return stopSearching
	})

	onNavigate((navigation) => {
		const fromChoice =
			navigation.from?.route.id === '/login' && navigation.to?.route.id === '/login/form'
		if (!fromChoice || matchMedia('(prefers-reduced-motion: reduce)').matches) return

		/** @param {Phase} next @param {string} name @param {{ x: number, y: number } | null} [look] */
		const step = (next, name, look = gaze) => {
			phase = next
			gaze = look
			return wait(duration(name))
		}

		return step('look-right', '--duration-auth-look', { x: 1, y: 0 })
			.then(() => step('look-left', '--duration-auth-look', { x: -1, y: 0 }))
			.then(() => step('shock', '--duration-auth-shock', null))
			.then(() => step('duck', '--duration-auth-duck'))
			.then(() => step('erase', '--duration-auth-erase'))
			.then(() => {
				phase = 'naked'
				startSearching()
				return wait(duration('--duration-auth-naked'))
			})
			.then(() => {
				stopSearching()
				arriving = true
			})
	})
</script>

<main
	id="content"
	class="auth-page"
	class:auth-page-compact={compact}
	class:auth-page-naked={naked}
>
	<div class="auth-top">
		<h1 class="auth-heading">Welcome to<br />CRE8 the platform</h1>
		<div class="auth-peek">
			<div
				class="auth-mascot is-{phase}"
				class:is-shocked={shocked}
				class:is-alarmed={alarm}
				aria-hidden="true"
				onanimationend={(event) => {
					if (event.target === event.currentTarget) phase = 'idle'
				}}
			>
				<Mascot size="var(--auth-mascot-size)" follow {gaze} />
			</div>
		</div>
	</div>

	<div class="auth-stage is-{phase}">
		<section class="auth-card" class:auth-card-split={bottom} aria-labelledby="auth-card-title">
			<div class="auth-card-shape" aria-hidden="true"></div>
			<div class="auth-card-half auth-card-half-top">
				<h2 id="auth-card-title" class="auth-card-title">{title}</h2>
				{#if intro}<p class="auth-card-intro">{intro}</p>{/if}
				{@render children()}
			</div>
			{#if bottom}<div class="auth-card-half auth-card-half-bottom">{@render bottom()}</div>{/if}
		</section>
		{#if phase === 'erase'}<EraserWipe contained />{/if}
		{#if phase === 'draw'}<EraserWipe mode="draw" contained />{/if}
	</div>

	<div class="auth-after">
		{#if after}{@render after()}{/if}
	</div>
</main>

<style>
	.auth-page {
		--auth-card-width: var(--size-auth-card);
		--auth-card-offset: clamp(0rem, 50dvh - 20rem, 7.5rem);
		--auth-heading-offset: clamp(0rem, 20dvh - 6rem, 4.5rem);
		--auth-notch: clamp(1.75rem, 1rem + 3.5vw, 3.5rem);
		--auth-notch-depth: calc(var(--auth-notch) * 1.6);

		display: grid;
		grid-template-rows: minmax(min-content, 1fr) auto minmax(min-content, 1fr);
		justify-items: center;
		block-size: 100dvh;
		padding: var(--space-m);
		overflow-x: clip;
		background-color: var(--color-background);
		text-align: center;
	}

	.auth-page-compact {
		--auth-notch: clamp(1rem, 0.6rem + 2vw, 2rem);
		--auth-split-gap: 0px;
		--auth-card-padding: var(--space-l);
	}

	.auth-top {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		inline-size: 100%;
		min-block-size: 0;
	}

	.auth-peek {
		--auth-mascot-size: min(
			clamp(24rem, 14rem + 30vw, 46rem),
			(100cqh + var(--auth-card-offset)) / 0.43
		);

		position: relative;
		flex: 1;
		inline-size: 100%;
		min-block-size: 0;
		container-type: size;
		clip-path: inset(-100vh -100vw calc(-1 * var(--auth-card-offset) - 0.5rem) -100vw);
	}

	.auth-heading {
		margin-block-start: var(--auth-heading-offset);
		font-size: calc(min(100vw - 2 * var(--space-m), var(--auth-card-width)) / 14.4);
		line-height: var(--line-height-tight);
	}

	.auth-stage {
		position: relative;
		translate: 0 var(--auth-card-offset);
		inline-size: min(100%, var(--auth-card-width));
	}

	.auth-mascot {
		position: absolute;
		inset-block-end: calc(-1 * (var(--auth-card-offset) + var(--auth-mascot-size) * 0.47));
		inset-inline: 0;
		z-index: 0;
		display: flex;
		justify-content: center;
		transition: translate var(--duration-auth-duck) ease-in;
	}

	.auth-mascot :global(.eyes) {
		transition: scale var(--duration-auth-shock) ease-out;
	}

	.auth-mascot :global(.body) {
		transition: fill var(--duration-normal) var(--easing-standard);
	}

	.auth-mascot.is-alarmed {
		--mascot-color: var(--color-error);
	}

	.auth-mascot.is-shocked :global(.eyes) {
		scale: 1.35;
	}

	.auth-mascot.is-duck,
	.auth-mascot.is-erase {
		translate: 0 calc(var(--auth-mascot-size) * 0.55);
	}

	.auth-mascot.is-naked {
		transition-timing-function: cubic-bezier(0.3, 1.6, 0.5, 1);
	}

	.auth-page-naked .auth-peek {
		clip-path: none;
	}

	.auth-stage {
		--eraser-duration: var(--duration-auth-erase);
	}

	.auth-stage.is-draw {
		--eraser-duration: var(--duration-auth-draw);
	}

	.auth-stage.is-naked .auth-card {
		visibility: hidden;
	}

	.auth-mascot.is-jump {
		animation: auth-jump var(--duration-auth-jump) ease-out;
	}

	@keyframes auth-jump {
		0% {
			translate: 0 0;
		}
		35% {
			translate: 0 calc(var(--auth-mascot-size) * -0.12);
		}
		60% {
			translate: 0 0;
		}
		78% {
			translate: 0 calc(var(--auth-mascot-size) * -0.035);
		}
		100% {
			translate: 0 0;
		}
	}

	.auth-mascot :global(.mascot) {
		flex-shrink: 0;
		max-inline-size: none;
		animation: none;
	}

	.auth-card {
		--focus-outline: var(--border-width-thick) solid var(--color-auth-card-text);

		position: relative;
		z-index: 1;
		isolation: isolate;
		display: grid;
		padding-block: var(--auth-card-padding, var(--space-xl));
		padding-inline: calc(var(--auth-notch-depth) + var(--space-s));
		color: var(--color-auth-card-text);
	}

	.auth-card-half {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: var(--space-s);
	}

	.auth-card-split {
		grid-template-rows: 1fr 1fr;
		row-gap: var(--auth-split-gap, var(--space-l));
	}

	.auth-card-split .auth-card-half-top {
		align-content: end;
	}

	.auth-card-split .auth-card-half-bottom {
		align-content: start;
	}

	.auth-card-shape {
		position: absolute;
		inset: 0;
		z-index: -1;
		filter: var(--rough-edge-strong);
	}

	.auth-card-shape::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius-card);
		background-color: var(--color-auth-card);
		clip-path: polygon(
			0 0,
			100% 0,
			100% calc(50% - var(--auth-notch)),
			calc(100% - var(--auth-notch-depth)) 50%,
			100% calc(50% + var(--auth-notch)),
			100% 100%,
			0 100%,
			0 calc(50% + var(--auth-notch)),
			var(--auth-notch-depth) 50%,
			0 calc(50% - var(--auth-notch))
		);
	}

	.auth-card-title {
		font-size: var(--font-size-project);
	}

	.auth-card-intro {
		margin-block-start: calc(var(--space-s) * -1 + var(--space-2xs));
		font-size: var(--font-size-small);
	}

	.auth-card :global(.auth-message) {
		font-size: var(--font-size-small);
	}

	.auth-card :global(a:not(.button)) {
		color: inherit;
	}

	.auth-after {
		align-self: start;
		translate: 0 var(--auth-card-offset);
		padding-block-start: var(--space-m);
		font-size: var(--font-size-small);
	}

	.auth-after :global(a) {
		color: inherit;
	}
</style>

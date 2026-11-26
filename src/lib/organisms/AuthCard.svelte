<script module>
	const BITS = [
		{ side: 'start', dx: '-5rem', dy: '-2.5rem', r: '-140deg' },
		{ side: 'start', dx: '-6.5rem', dy: '0.5rem', r: '-60deg' },
		{ side: 'start', dx: '-4rem', dy: '3rem', r: '-200deg' },
		{ side: 'end', dx: '5rem', dy: '-3rem', r: '160deg' },
		{ side: 'end', dx: '6rem', dy: '0.75rem', r: '80deg' },
		{ side: 'end', dx: '4.5rem', dy: '2.75rem', r: '220deg' }
	]

	let arriving = false
	/** @type {ViewTransition | null} */
	let transition = null
</script>

<script>
	import { onNavigate } from '$app/navigation'
	import Mascot from '#lib/atoms/Mascot.svelte'

	/** @type {{ title: string, intro?: string, compact?: boolean, children: import('svelte').Snippet, bottom?: import('svelte').Snippet, after?: import('svelte').Snippet }} */
	const { title, intro, compact = false, children, bottom, after } = $props()

	/** @type {'idle' | 'shock' | 'duck' | 'hidden' | 'jump'} */
	let mood = $state(arriving ? 'hidden' : 'idle')
	const burst = arriving

	const duration = (/** @type {string} */ name) =>
		parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0
	const wait = (/** @type {number} */ ms) => new Promise((done) => setTimeout(done, ms))

	$effect(() => {
		if (!arriving) return
		arriving = false
		const finished = transition?.finished ?? Promise.resolve()
		transition = null
		finished.then(() => (mood = 'jump'))
	})

	onNavigate((navigation) => {
		const fromChoice =
			navigation.from?.route.id === '/login' && navigation.to?.route.id === '/login/form'
		if (
			!document.startViewTransition ||
			!fromChoice ||
			matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return

		return new Promise((resolve) => {
			mood = 'shock'
			wait(duration('--duration-auth-shock'))
				.then(() => {
					mood = 'duck'
					return wait(duration('--duration-auth-duck'))
				})
				.then(() => {
					arriving = true
					transition = document.startViewTransition(async () => {
						resolve()
						await navigation.complete
					})
				})
		})
	})
</script>

<main id="content" class="auth-page" class:auth-page-compact={compact}>
	<div class="auth-top">
		<h1 class="auth-heading">Welcome to<br />CRE8 the platform</h1>
		<div class="auth-peek">
			<div
				class="auth-mascot is-{mood}"
				aria-hidden="true"
				onanimationend={(event) => {
					if (event.target === event.currentTarget) mood = 'idle'
				}}
			>
				<Mascot size="var(--auth-mascot-size)" follow />
			</div>
		</div>
	</div>

	<div class="auth-stage">
		<section class="auth-card" class:auth-card-split={bottom} aria-labelledby="auth-card-title">
			<div class="auth-card-shape" aria-hidden="true"></div>
			{#if burst}
				<div class="auth-bits" aria-hidden="true">
					{#each BITS as bit, index (index)}
						<span
							class="auth-bit auth-bit-{bit.side}"
							style:--bit-dx={bit.dx}
							style:--bit-dy={bit.dy}
							style:--bit-r={bit.r}
						></span>
					{/each}
				</div>
			{/if}
			<div class="auth-card-half auth-card-half-top">
				<h2 id="auth-card-title" class="auth-card-title">{title}</h2>
				{#if intro}<p class="auth-card-intro">{intro}</p>{/if}
				{@render children()}
			</div>
			{#if bottom}<div class="auth-card-half auth-card-half-bottom">{@render bottom()}</div>{/if}
		</section>
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
		view-transition-name: auth-card;
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

	.auth-mascot.is-shock :global(.eyes),
	.auth-mascot.is-duck :global(.eyes) {
		scale: 1.35;
	}

	.auth-mascot.is-duck,
	.auth-mascot.is-hidden {
		translate: 0 calc(var(--auth-mascot-size) * 0.55);
	}

	.auth-mascot.is-jump {
		animation: auth-jump var(--duration-auth-jump) ease-out;
	}

	@keyframes auth-jump {
		0% {
			translate: 0 calc(var(--auth-mascot-size) * 0.55);
		}
		45% {
			translate: 0 calc(var(--auth-mascot-size) * -0.08);
		}
		65% {
			translate: 0 0;
		}
		80% {
			translate: 0 calc(var(--auth-mascot-size) * -0.025);
		}
		100% {
			translate: 0 0;
		}
	}

	.auth-bits {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
	}

	.auth-bit {
		position: absolute;
		inset-block-start: 50%;
		inline-size: 0.7rem;
		block-size: 0.45rem;
		border-radius: var(--radius-small);
		background-color: var(--color-auth-card);
		opacity: 0;
		filter: var(--rough-edge);
		animation: auth-bit calc(var(--duration-auth-shake) * 0.65) ease-out
			calc(var(--duration-auth-shake) * 0.3) forwards;
	}

	.auth-bit:nth-child(even) {
		background-color: var(--color-pencil);
	}

	.auth-bit-start {
		inset-inline-start: 0;
	}

	.auth-bit-end {
		inset-inline-end: 0;
	}

	@keyframes auth-bit {
		0% {
			opacity: 1;
			translate: 0 0;
			rotate: 0deg;
		}
		100% {
			opacity: 0;
			translate: var(--bit-dx) var(--bit-dy);
			rotate: var(--bit-r);
		}
	}

	:global(::view-transition-group(auth-card)) {
		animation-duration: var(--duration-auth-shake);
	}

	:global(::view-transition-old(auth-card)) {
		animation:
			auth-shake var(--duration-auth-shake) ease-in-out both,
			auth-card-out var(--duration-auth-shake) ease-in both;
	}

	:global(::view-transition-new(auth-card)) {
		animation:
			auth-shake var(--duration-auth-shake) ease-in-out both,
			auth-card-in var(--duration-auth-shake) ease-out both;
	}

	@keyframes -global-auth-shake {
		0%,
		100% {
			transform: none;
		}
		12% {
			transform: translateX(-0.6rem) rotate(-2.5deg);
		}
		26% {
			transform: translateX(0.6rem) rotate(2.5deg);
		}
		40% {
			transform: translateX(-0.45rem) rotate(-1.8deg);
		}
		54% {
			transform: translateX(0.45rem) rotate(1.8deg);
		}
		70% {
			transform: translateX(-0.2rem) rotate(-0.8deg);
		}
		85% {
			transform: translateX(0.1rem) rotate(0.4deg);
		}
	}

	@keyframes -global-auth-card-out {
		0%,
		40% {
			opacity: 1;
		}
		60%,
		100% {
			opacity: 0;
		}
	}

	@keyframes -global-auth-card-in {
		0%,
		35% {
			opacity: 0;
		}
		55%,
		100% {
			opacity: 1;
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

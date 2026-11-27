<script module>
	let arriving = false
</script>

<script>
	import { onNavigate } from '$app/navigation'
	import Mascot from '#lib/atoms/Mascot.svelte'
	import ShockMarks from '#lib/atoms/ShockMarks.svelte'
	import MascotBack from '#lib/atoms/MascotBack.svelte'

	/** @type {{ title: string, intro?: string, alarm?: number, compact?: boolean, children: import('svelte').Snippet, bottom?: import('svelte').Snippet, after?: import('svelte').Snippet }} */
	const { title, intro, alarm = 0, compact = false, children, bottom, after } = $props()

	/** @typedef {'idle' | 'duck' | 'erase' | 'back' | 'turn' | 'shock' | 'draw' | 'jump'} Phase */
	let phase = $state(/** @type {Phase} */ (arriving ? 'shock' : 'idle'))
	const caught = $derived(['erase', 'back', 'turn', 'shock', 'draw'].includes(phase))
	const facing = $derived(phase === 'shock' || phase === 'draw')
	/** @type {HTMLDivElement | undefined} */
	let stage = $state()

	$effect(() => {
		if (!alarm || !stage) return
		stage.classList.remove('is-shaking')
		void stage.offsetWidth
		stage.classList.add('is-shaking')
	})

	const ZIGZAG =
		'M-10 3L110 9L-10 17L110 25L-10 33L110 41L-10 49L110 57L-10 65L110 73L-10 81L110 89L-10 97L110 105'

	/** @param {'erase' | 'draw'} mode @param {number} ms */
	const strokeMask = (mode, ms) => {
		const stroke = `<path pathLength='1' d='${ZIGZAG}' fill='none' stroke='black' stroke-width='17' stroke-linecap='round' stroke-linejoin='round' filter='url(#r)'/>`
		const rough = `<filter id='r' x='-10%' y='-10%' width='120%' height='120%'><feTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='3' seed='${Date.now() % 97}'/><feDisplacementMap in='SourceGraphic' scale='2.5'/></filter>`
		const motion = `<style>path{stroke-dasharray:1;stroke-dashoffset:1;animation:m ${ms}ms ease-in-out forwards}@keyframes m{to{stroke-dashoffset:0}}</style>`
		const body =
			mode === 'erase'
				? `<defs>${rough}<mask id='h'><rect x='-10' y='-10' width='120' height='120' fill='white'/>${stroke}</mask></defs><rect x='-10' y='-10' width='120' height='120' mask='url(#h)'/>`
				: `<defs>${rough}</defs>${stroke}`
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${motion}${body}</svg>`
		return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
	}

	const duration = (/** @type {string} */ name) =>
		parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0
	const wait = (/** @type {number} */ ms) => new Promise((done) => setTimeout(done, ms))

	const cardMask = $derived(
		phase === 'erase'
			? strokeMask('erase', duration('--duration-auth-erase'))
			: phase === 'draw'
				? strokeMask('draw', duration('--duration-auth-draw'))
				: undefined
	)

	$effect(() => {
		if (!arriving) return
		arriving = false
		phase = 'draw'
		wait(duration('--duration-auth-draw')).then(() => (phase = 'jump'))
	})

	onNavigate((navigation) => {
		const fromChoice =
			navigation.from?.route.id === '/login' && navigation.to?.route.id === '/login/form'
		if (!fromChoice || matchMedia('(prefers-reduced-motion: reduce)').matches) return

		phase = 'duck'
		return wait(duration('--duration-auth-duck'))
			.then(() => {
				phase = 'erase'
				return wait(duration('--duration-auth-erase'))
			})
			.then(() => {
				phase = 'back'
				return wait(duration('--duration-auth-back'))
			})
			.then(() => {
				phase = 'turn'
				return wait(duration('--duration-auth-turn'))
			})
			.then(() => {
				phase = 'shock'
				return wait(duration('--duration-auth-startle'))
			})
			.then(() => {
				arriving = true
			})
	})
</script>

<main id="content" class="auth-page" class:auth-page-compact={compact}>
	<div class="auth-top">
		<h1 class="auth-heading">Welcome to<br />CRE8 the platform</h1>
		<div class="auth-peek">
			<div
				class="auth-mascot is-{phase}"
				class:is-alarmed={alarm > 0}
				aria-hidden="true"
				onanimationend={(event) => {
					if (event.target === event.currentTarget) phase = 'idle'
				}}
			>
				<Mascot size="var(--auth-mascot-size)" follow />
			</div>
		</div>
	</div>

	<div class="auth-stage is-{phase}" bind:this={stage}>
		<section
			class="auth-card"
			class:auth-card-split={bottom}
			style:mask-image={cardMask}
			aria-labelledby="auth-card-title"
		>
			<div class="auth-card-shape" aria-hidden="true"></div>
			<div class="auth-card-half auth-card-half-top">
				<h2 id="auth-card-title" class="auth-card-title">{title}</h2>
				{#if intro}<p class="auth-card-intro">{intro}</p>{/if}
				{@render children()}
			</div>
			{#if bottom}<div class="auth-card-half auth-card-half-bottom">{@render bottom()}</div>{/if}
		</section>
		{#if caught}
			<div class="auth-caught is-{phase}" aria-hidden="true">
				<div class="auth-caught-actor">
					{#if facing}
						<Mascot size="var(--auth-caught-size)" />
						{#if phase === 'shock'}<ShockMarks />{/if}
					{:else}
						<Mascot size="var(--auth-caught-size)" face={false} />
						<MascotBack />
					{/if}
				</div>
			</div>
		{/if}
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

	.auth-mascot :global(.body) {
		transition: fill var(--duration-normal) var(--easing-standard);
	}

	.auth-mascot.is-alarmed {
		--mascot-color: var(--color-error);
	}

	.auth-mascot :global(.eyes) {
		transition: scale var(--duration-auth-duck) ease-out;
	}

	.auth-mascot.is-duck :global(.eyes) {
		scale: 1.35;
	}

	.auth-mascot.is-duck,
	.auth-mascot.is-erase,
	.auth-mascot.is-back,
	.auth-mascot.is-turn,
	.auth-mascot.is-shock,
	.auth-mascot.is-draw {
		translate: 0 calc(var(--auth-mascot-size) * 0.55);
	}

	.auth-mascot.is-back,
	.auth-mascot.is-turn,
	.auth-mascot.is-shock,
	.auth-mascot.is-draw {
		transition: none;
	}

	.auth-mascot.is-jump {
		animation: auth-jump var(--duration-auth-jump) ease-out;
	}

	.auth-stage {
		--auth-caught-size: min(22rem, 70vw, 55dvh);
	}

	.auth-stage.is-erase .auth-card,
	.auth-stage.is-draw .auth-card {
		mask-size: calc(100% + 3rem) calc(100% + 3rem);
		mask-position: center;
		mask-repeat: no-repeat;
	}

	.auth-stage.is-back .auth-card,
	.auth-stage.is-turn .auth-card,
	.auth-stage.is-shock .auth-card {
		visibility: hidden;
	}

	.auth-caught {
		position: absolute;
		inset: 0;
		z-index: 0;
		display: grid;
		place-items: center;
		pointer-events: none;
	}

	.auth-caught.is-back,
	.auth-caught.is-turn,
	.auth-caught.is-shock {
		z-index: 2;
	}

	.auth-caught-actor {
		position: relative;
		display: flex;
	}

	.auth-caught :global(.mascot) {
		max-inline-size: none;
		animation: none;
	}

	.auth-caught :global(.eyes) {
		scale: 1.45;
	}

	.auth-caught.is-erase .auth-caught-actor,
	.auth-caught.is-back .auth-caught-actor {
		animation: auth-wiggle calc(var(--duration-auth-back) / 3) ease-in-out infinite alternate;
	}

	.auth-caught.is-turn .auth-caught-actor {
		animation: auth-turn-away var(--duration-auth-turn) ease-in forwards;
	}

	.auth-caught.is-shock .auth-caught-actor {
		animation: auth-startle var(--duration-auth-startle) cubic-bezier(0.3, 1.4, 0.5, 1);
	}

	@keyframes auth-wiggle {
		from {
			rotate: -5deg;
		}
		to {
			rotate: 5deg;
		}
	}

	@keyframes auth-turn-away {
		to {
			scale: 0 1;
		}
	}

	@keyframes auth-startle {
		0% {
			scale: 0 1;
		}
		30% {
			scale: 1.15 0.85;
			translate: 0 0;
		}
		55% {
			scale: 0.95 1.12;
			translate: 0 -14%;
		}
		80% {
			scale: 1.04 0.96;
			translate: 0 0;
		}
		100% {
			scale: 1;
			translate: 0 0;
		}
	}

	.auth-caught.is-draw .auth-caught-actor {
		animation: auth-dive var(--duration-auth-hide) cubic-bezier(0.6, 0, 0.9, 0.4) forwards;
	}

	@keyframes auth-dive {
		to {
			scale: 0.6;
			translate: 0 -45%;
		}
	}

	@keyframes auth-jump {
		0% {
			translate: 0 calc(var(--auth-mascot-size) * 0.55);
		}
		45% {
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

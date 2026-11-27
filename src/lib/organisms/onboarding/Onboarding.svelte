<script>
	import { ONBOARDING_STEPS, stepHref } from '#lib/utils/onboarding.js'
	import StepHello from './StepHello.svelte'

	/** @typedef {{ name: string | null, color: string, shape: string, matchWorkspace: boolean }} Assistant */
	/** @type {{ step: number, userName: string | null, assistant: Assistant, form?: unknown }} */
	const { step, userName, assistant, form } = $props()

	const canSkip = $derived(step > 0 && step < 6)
</script>

<div class="onboarding" data-assistant-color={assistant.color}>
	<header class="onboarding-header">
		<span class="onboarding-brand">CRE8</span>
		<ol class="onboarding-progress" aria-label="Setup progress">
			{#each ONBOARDING_STEPS as { id, label }, index (id)}
				<li
					class:done={index <= step}
					class:current={index === step}
					aria-current={index === step ? 'step' : undefined}
				>
					<span class="visually-hidden">
						Step {index + 1} of {ONBOARDING_STEPS.length}, {label}{index === step
							? ', current'
							: ''}
					</span>
				</li>
			{/each}
		</ol>
		{#if canSkip}
			<a class="onboarding-skip" href={stepHref(6)}>Skip the small talk</a>
		{/if}
	</header>

	<main id="content" class="onboarding-main">
		{#key step}
			{#if step === 0}
				<StepHello shape={assistant.shape} next={stepHref(1)} />
			{:else}
				<p class="onboarding-line">{ONBOARDING_STEPS[step].label}</p>
			{/if}
		{/key}
	</main>
</div>

<style>
	.onboarding {
		display: flex;
		flex-direction: column;
		inline-size: 100%;
		min-block-size: 100dvh;
		padding: var(--space-l) var(--space-m) var(--space-xl);
		text-align: center;
	}

	.onboarding-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.onboarding-brand {
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: 0.08em;
	}

	.onboarding-progress {
		display: flex;
		gap: var(--space-xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.onboarding-progress li {
		position: relative;
		inline-size: 10px;
		block-size: 10px;
		border-radius: var(--radius-pill);
		background-color: var(--color-border);
		transition: inline-size var(--duration-normal) var(--easing-standard);
	}

	.onboarding-progress li.done {
		background-color: var(--color-text);
	}

	.onboarding-progress li.current {
		inline-size: 28px;
	}

	.onboarding-skip {
		display: inline-flex;
		align-items: center;
		min-block-size: 2.75rem;
		color: var(--color-text-muted);
		font-size: var(--font-size-small);
		text-decoration: underline;
	}

	.onboarding-main {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-l);
		inline-size: 100%;
		max-inline-size: 41.25rem;
		margin-inline: auto;
		padding-block-start: var(--space-l);
	}

	/* Shared layout and text styles for the steps */
	.onboarding :global(.step) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
		inline-size: 100%;
	}

	/* With JavaScript the animated steps wait for their first frame, without it they show the end state */
	:global(html.js) .onboarding :global([data-started='false']) {
		visibility: hidden;
	}

	.onboarding :global(.rise) {
		animation: rise 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) both;
	}

	@media (prefers-reduced-motion: reduce) {
		.onboarding :global(.rise) {
			animation: none;
		}
	}

	@keyframes rise {
		0% {
			transform: scale(0) rotate(-20deg);
		}
		100% {
			transform: scale(1) rotate(0);
		}
	}

	.onboarding :global(.onboarding-title) {
		font-size: clamp(1.75rem, 1.4rem + 1.6vw, 2.25rem);
		line-height: 1.08;
		text-transform: uppercase;
	}

	.onboarding :global(.onboarding-shout) {
		font-size: clamp(2rem, 1.5rem + 2.4vw, 2.75rem);
		line-height: 1.05;
		text-transform: uppercase;
	}

	.onboarding :global(.onboarding-line) {
		max-inline-size: 32.5rem;
		font-size: clamp(1.125rem, 1rem + 0.6vw, 1.375rem);
		line-height: 1.4;
	}

	.onboarding :global(.onboarding-text) {
		max-inline-size: 31.25rem;
		color: var(--color-text-muted);
		line-height: 1.55;
	}

	.onboarding :global(.onboarding-actions) {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-s);
	}
</style>

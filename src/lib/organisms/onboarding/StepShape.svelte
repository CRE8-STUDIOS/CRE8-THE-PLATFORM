<script>
	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import Mascot from '#lib/atoms/Mascot.svelte'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import { ASSISTANT_SHAPES } from '#lib/utils/constants.js'
	import { SHAPE_LINES, stepAction } from '#lib/utils/onboarding.js'

	/** @type {{ shape: string, name: string, color: string, back: string }} */
	const { shape: saved, name, color, back } = $props()

	let shape = $state(untrack(() => saved))
</script>

<div class="step" data-assistant-color={color}>
	<MascotStage size="min(220px, 55vw)" {shape} label="{name}, {color} {shape}" />

	<h1 class="onboarding-title">Pick my shape.</h1>
	<p class="onboarding-text">
		I'm basically jelly with ambition. Fully flexible. Yoga teachers are jealous. Pick one and I'll
		squish myself into it.
	</p>

	<form class="step-form" method="POST" action={stepAction('shape', 'shape')} use:enhance>
		<fieldset class="shapes">
			<legend class="visually-hidden">Assistant shape</legend>
			{#each ASSISTANT_SHAPES as option (option)}
				<label class="shape">
					<input
						class="visually-hidden"
						type="radio"
						name="assistant_shape"
						value={option}
						bind:group={shape}
					/>
					<span aria-hidden="true">
						<Mascot size="44px" shape={option} face={false} animate={false} />
					</span>
					<span>{SHAPE_LINES[option].name}</span>
				</label>
			{/each}
		</fieldset>

		<p class="onboarding-line" aria-live="polite">{SHAPE_LINES[shape]?.line}</p>

		<div class="onboarding-actions">
			<a class="button button-secondary" href={back}>Back</a>
			<button class="button button-primary">Transform me</button>
		</div>
	</form>
</div>

<style>
	.shapes {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-s);
	}

	.shape {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		min-inline-size: 84px;
		padding: 12px 10px;
		border: 1.5px dashed var(--color-border);
		border-radius: var(--radius-card);
		font-family: var(--font-family-display);
		font-size: 0.625rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.shape:has(input:checked) {
		border-style: solid;
		border-color: var(--color-text);
		background-color: var(--color-surface);
	}

	.shape:has(input:focus-visible) {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}
</style>

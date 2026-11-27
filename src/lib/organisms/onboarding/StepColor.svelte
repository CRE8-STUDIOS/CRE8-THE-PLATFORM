<script>
	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import { ASSISTANT_COLORS } from '#lib/utils/constants.js'
	import { COLOR_LINES, stepAction } from '#lib/utils/onboarding.js'

	/** @type {{ shape: string, name: string, color: string, back: string }} */
	const { shape, name, color: saved, back } = $props()

	let color = $state(untrack(() => saved))
</script>

<div class="step" data-assistant-color={color}>
	<MascotStage size="min(220px, 55vw)" {shape} label="{name}, {color} {shape}" />

	<h1 class="onboarding-title">What's my color?</h1>
	<p class="onboarding-text">
		Choose wisely. The last time I picked my own color I looked like a leaking printer cartridge.
	</p>

	<form class="step-form" method="POST" action={stepAction('color', 'color')} use:enhance>
		<fieldset class="swatches">
			<legend class="visually-hidden">Assistant color</legend>
			{#each ASSISTANT_COLORS as option (option)}
				<label class="swatch" data-assistant-color={option}>
					<input
						class="visually-hidden"
						type="radio"
						name="assistant_color"
						value={option}
						bind:group={color}
					/>
					<span class="visually-hidden">{COLOR_LINES[option].name}</span>
				</label>
			{/each}
		</fieldset>

		<p class="onboarding-line" aria-live="polite">{COLOR_LINES[color]?.line}</p>

		<div class="onboarding-actions">
			<a class="button button-secondary" href={back}>Back</a>
			<button class="button button-primary">This is me now</button>
		</div>
	</form>
</div>

<style>
	.swatches {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px;
	}

	.swatch {
		inline-size: 52px;
		block-size: 52px;
		border: 3px solid transparent;
		border-radius: var(--radius-pill);
		background-color: var(--mascot-color);
		box-shadow: inset 0 0 0 3px var(--color-background);
		cursor: pointer;
		transition: transform 0.2s;
	}

	.swatch:has(input:checked) {
		border-color: var(--color-text);
		transform: scale(1.12);
	}

	.swatch:has(input:focus-visible) {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}
</style>

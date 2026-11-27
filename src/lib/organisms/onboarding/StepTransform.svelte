<script>
	import { untrack } from 'svelte'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import Curtains from '#lib/atoms/mascot-props/Curtains.svelte'
	import Sparkles from '#lib/atoms/mascot-props/Sparkles.svelte'
	import { SHOW } from '#lib/utils/onboarding.js'
	import { Timeline } from '#lib/utils/timeline.svelte.js'
	import { sounds } from '#lib/utils/sound.js'

	/** @type {{ shape: string, color: string, label: string, next: string }} */
	const { shape, color, label, next } = $props()

	const show = new Timeline(SHOW)
	const phase = $derived(show.phase)

	$effect(() => {
		untrack(() => show.play())
		return () => show.stop()
	})

	$effect(() => {
		if (!show.started) return
		if (phase === 'drum') {
			sounds.swoosh()
			sounds.drumroll(2.9)
		}
		if (phase === 'boom') {
			sounds.swoosh()
			sounds.boom()
		}
	})

	const replay = (/** @type {MouseEvent} */ event) => {
		event.preventDefault()
		show.play()
	}
</script>

<div class="step" data-started={show.started}>
	<div class="theatre">
		{#if phase === 'boom'}
			<div data-assistant-color={color}>
				<MascotStage size="min(260px, 60vw, 30dvh)" {shape} {label} motion="pop">
					<Sparkles />
				</MascotStage>
			</div>
		{:else}
			<div data-assistant-color="ink">
				<MascotStage size="min(240px, 55vw, 28dvh)" shape="splat" label="The original blob" />
			</div>
		{/if}
		<Curtains closed={phase === 'drum'} />
	</div>

	<div class="show-words" aria-live="polite">
		{#if phase === 'before'}
			<p class="onboarding-line">okay. deep breath. this is my last look as the old me.</p>
		{:else if phase === 'drum'}
			<h1 class="onboarding-title">Drum roll please...</h1>
			<p class="onboarding-line"><span class="drum">brrrrrrrrrrrrr</span></p>
		{:else}
			<h1 class="onboarding-shout boom rise">Boom. New me.</h1>
			<div class="onboarding-actions">
				<a class="button button-secondary" href="?step=transform" onclick={replay}>Again!</a>
				<a class="button button-primary" href={next}>Gorgeous. Next</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.theatre {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		inline-size: 440px;
		max-inline-size: 100%;
		block-size: min(360px, 40dvh);
		overflow: hidden;
		border: 1.5px solid var(--color-text);
		border-radius: 18px;
		background-color: var(--color-surface);
	}

	.show-words {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		min-block-size: 0;
	}

	.boom {
		font-size: clamp(2.5rem, 1.75rem + 3.2vw, 3.5rem);
	}

	.drum {
		display: inline-block;
	}

	@media (prefers-reduced-motion: no-preference) {
		.drum {
			animation: shake 0.06s linear infinite;
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}
</style>

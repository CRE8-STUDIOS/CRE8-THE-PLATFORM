<script>
	import { untrack } from 'svelte'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import Mirror from '#lib/atoms/mascot-props/Mirror.svelte'
	import Foam from '#lib/atoms/mascot-props/Foam.svelte'
	import Sparkles from '#lib/atoms/mascot-props/Sparkles.svelte'
	import { INTRO } from '#lib/utils/onboarding.js'
	import { Timeline } from '#lib/utils/timeline.svelte.js'
	import { sounds } from '#lib/utils/sound.js'

	/** @type {{ shape: string, next: string }} */
	const { shape, next } = $props()

	/** @type {Record<string, string>} */
	const EYES = {
		wash: 'translate(-16px, 2px)',
		scream: 'translate(100px, 98px) scale(1.4) translate(-100px, -106px)',
		hmm: 'translate(8px, -4px)'
	}

	/** @type {Record<string, 'scrub' | 'jump' | 'bob' | 'spin'>} */
	const MOTION = {
		wash: 'scrub',
		scream: 'jump',
		scared: 'bob',
		hmm: 'bob',
		poof: 'spin',
		ready: 'bob'
	}

	const intro = new Timeline(INTRO)
	const phase = $derived(intro.phase)

	$effect(() => {
		untrack(() => intro.play())
		return () => intro.stop()
	})

	$effect(() => {
		if (!intro.started) return
		if (phase === 'wash') {
			const lather = setInterval(sounds.bubble, 450)
			return () => clearInterval(lather)
		}
		if (phase === 'scream') sounds.scream()
		if (phase === 'poof') sounds.poof()
		if (phase === 'ready') sounds.sparkle()
	})

	const replay = (/** @type {MouseEvent} */ event) => {
		event.preventDefault()
		intro.play()
	}
</script>

<div class="step" data-started={intro.started}>
	<div class="hello-stage">
		{#if phase === 'wash' || phase === 'scream'}<Mirror {shape} />{/if}
		<MascotStage
			size="min(300px, 55vw, 34dvh)"
			{shape}
			eyes={EYES[phase]}
			motion={MOTION[phase]}
			label={phase === 'ready'
				? 'The CRE8 assistant, freshly washed and sparkling'
				: 'The CRE8 assistant washing its hair in front of a mirror'}
		>
			{#snippet front()}<Foam scrub bubbles visible={phase !== 'ready'} />{/snippet}
			{#if phase === 'ready'}<Sparkles />{/if}
		</MascotStage>
	</div>

	<div class="hello-words" aria-live="polite">
		{#if phase === 'wash'}
			<p class="onboarding-line">la la la, lather, rinse, repeat...</p>
		{:else if phase === 'scream'}
			<h1 class="onboarding-shout scream rise">Aaaaahhh!</h1>
		{:else if phase === 'scared'}
			<h1 class="onboarding-shout rise">Oh. You scared me.</h1>
		{:else if phase === 'hmm' || phase === 'poof'}
			<p class="onboarding-line rise">hmm... oh, hi! one sec.</p>
		{:else}
			<h1 class="onboarding-shout rise">Okay. Ready. Fresh.</h1>
			<p class="onboarding-text">Nobody saw that. Let's start again, professionally.</p>
			<div class="onboarding-actions">
				<a class="button button-secondary" href="?step=hello" onclick={replay}>Watch again</a>
				<a class="button button-primary" href={next}>Hi?</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.hello-stage {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: var(--space-2xl);
		block-size: min(330px, 38dvh);
	}

	@media (width < 30rem) {
		.hello-stage {
			gap: var(--space-m);
		}
	}

	.hello-words {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		min-block-size: 0;
	}

	.scream {
		font-size: clamp(2.75rem, 2rem + 3.5vw, 4rem);
	}
</style>

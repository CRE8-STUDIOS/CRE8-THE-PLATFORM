<script>
	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import RobinCape from '#lib/atoms/mascot-props/RobinCape.svelte'
	import RobinMask from '#lib/atoms/mascot-props/RobinMask.svelte'
	import Sherlock from '#lib/atoms/mascot-props/Sherlock.svelte'
	import Cheese from '#lib/atoms/mascot-props/Cheese.svelte'
	import Sprinkles from '#lib/atoms/mascot-props/Sprinkles.svelte'
	import Charger from '#lib/atoms/mascot-props/Charger.svelte'
	import Fries from '#lib/atoms/mascot-props/Fries.svelte'
	import Ketchup from '#lib/atoms/mascot-props/Ketchup.svelte'
	import Tape from '#lib/atoms/mascot-props/Tape.svelte'
	import { ASSISTANT_NAME_MAX } from '#lib/utils/constants.js'
	import { prefersCalm } from '#lib/utils/timeline.svelte.js'
	import {
		COSTUMES,
		COSTUME_FILL,
		RAMBLE,
		REAL,
		typingPause,
		stepAction
	} from '#lib/utils/onboarding.js'

	/** @type {{ shape: string, color: string, assistantName: string | null, userName: string | null, back: string }} */
	const { shape, color, assistantName, userName, back } = $props()

	const FULL = `I'm going to be your right hand. ${REAL}`

	// Starts at the end, so without JavaScript the real text and the form show.
	let phase = $state(/** @type {'ramble' | 'tape' | 'delete' | 'real' | 'done'} */ ('done'))
	let typed = $state(REAL)
	let spoken = $state(FULL)
	let started = $state(false)

	/** @type {ReturnType<typeof setTimeout>[]} */
	let timers = []
	const later = (/** @type {() => void} */ run, /** @type {number} */ ms) =>
		timers.push(setTimeout(run, ms))
	const clear = () => {
		for (const timer of timers) clearTimeout(timer)
		timers = []
	}

	/** @param {string} text @param {number} count @param {number} ms @param {() => void} done */
	const typeOut = (text, count, ms, done) => {
		typed = text.slice(0, count)
		if (count < text.length)
			later(() => typeOut(text, count + 1, ms, done), ms + typingPause(text, count))
		else done()
	}

	/** @param {number} count @param {() => void} done */
	const erase = (count, done) => {
		typed = RAMBLE.slice(0, Math.max(0, count))
		if (count > 0) later(() => erase(count - 4, done), 18)
		else done()
	}

	const speak = () => {
		clear()
		typed = ''
		phase = 'ramble'
		later(
			() =>
				typeOut(RAMBLE, 0, 62, () => {
					phase = 'tape'
					later(() => {
						phase = 'delete'
						erase(RAMBLE.length, () => {
							phase = 'real'
							later(() => typeOut(REAL, 0, 50, () => (phase = 'done')), 500)
						})
					}, 2200)
				}),
			600
		)
	}

	const finish = () => {
		clear()
		typed = REAL
		phase = 'done'
	}

	$effect(() => {
		untrack(() => {
			started = true
			spoken = ''
			later(() => (spoken = FULL), 100)
			if (prefersCalm()) finish()
			else speak()
		})
		return clear
	})

	const costume = $derived.by(() => {
		if (phase === 'real' || phase === 'done') return 'none'
		let current = 'none'
		for (const [id, at] of COSTUMES) if (typed.length > at + 4) current = id
		return current
	})
	const taped = $derived(phase === 'tape' || phase === 'delete')
</script>

<div class="step" data-started={started}>
	<div class="speaker" style:--mascot-color={COSTUME_FILL[costume]}>
		<MascotStage
			size="min(220px, 55vw)"
			{shape}
			motion={phase === 'tape' ? 'scrub' : 'bob'}
			label="{assistantName || 'The CRE8 assistant'}, {color} {shape}"
		>
			{#snippet back()}
				{#if costume === 'robin'}<RobinCape />{/if}
			{/snippet}
			{#snippet front()}
				{#if costume === 'robin'}<RobinMask />{/if}
				{#if costume === 'sherlock'}<Sherlock />{/if}
				{#if costume === 'cheese'}<Cheese />{/if}
				{#if costume === 'sprinkles'}<Sprinkles />{/if}
				{#if costume === 'charger'}<Charger />{/if}
				{#if costume === 'fries'}<Fries />{/if}
				{#if costume === 'ketchup'}<Ketchup />{/if}
				{#if taped}<Tape />{/if}
			{/snippet}
		</MascotStage>
	</div>

	<h1 class="onboarding-title">Hiii! I'm your new assistant.</h1>

	<div class="speech">
		<p class="typed" aria-hidden="true">{typed}<span class="caret"></span></p>
		<p class="visually-hidden" aria-live="polite">{spoken}</p>
		{#if taped}<p class="onboarding-line rise">mmmph! mmph mmmph!!</p>{/if}
	</div>

	{#if phase === 'done'}
		<form
			class="step-form rise"
			method="POST"
			action={stepAction('your-name', 'yourName')}
			use:enhance
		>
			<label class="onboarding-field">
				So, what do I call you?
				<input
					name="name"
					value={userName ?? ''}
					maxlength={ASSISTANT_NAME_MAX}
					autocomplete="given-name"
					placeholder="Your name, or something cooler"
				/>
			</label>
			<div class="onboarding-actions">
				<a class="button button-secondary" href={back}>Back</a>
				<button class="button button-primary">That's me</button>
			</div>
		</form>
	{:else}
		<button type="button" class="onboarding-link" onclick={finish}>Skip the speech</button>
	{/if}
</div>

<style>
	.speaker {
		display: contents;
	}

	.speech {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		min-block-size: 110px;
		max-inline-size: 32.5rem;
	}

	.typed {
		font-size: 1.125rem;
		line-height: 1.55;
	}

	.caret {
		display: inline-block;
		inline-size: 2px;
		block-size: 1.1em;
		margin-inline-start: 2px;
		vertical-align: -3px;
		background-color: var(--color-text);
	}

	@media (prefers-reduced-motion: no-preference) {
		.caret {
			animation: caret 0.8s steps(1) infinite;
		}
	}

	@keyframes caret {
		50% {
			opacity: 0;
		}
	}
</style>

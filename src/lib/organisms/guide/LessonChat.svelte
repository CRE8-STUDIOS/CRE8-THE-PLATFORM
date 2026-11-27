<script>
	import { tick, untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import MascotSays from '#lib/molecules/MascotSays.svelte'

	/**
	 * A lesson as a chat. The assistant's lines of a new step appear one by
	 * one (at once with reduced motion), then the answers. Every answer is a
	 * form post, so it works without JavaScript too.
	 * @type {{
	 *   step: number,
	 *   history: { step: number, bot: string[], me: string | null }[],
	 *   current: { bot: string[], options: { label: string }[] },
	 *   last: boolean,
	 *   feedback?: { step: number, label: string, feedback: string } | null
	 * }}
	 */
	const { step, history, current, last, feedback = null } = $props()

	/** The step shown when the page opened: that one is not animated */
	const firstStep = untrack(() => step)
	/** Answers tapped in this visit, so the chat can show them */
	/** @type {Record<number, string>} */
	const said = $state({})

	let revealed = $state(Infinity)
	/** @type {HTMLElement | undefined} */
	let log = $state()

	const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

	/** Moves focus to the newest message, for keyboard and screen reader users */
	const focusNewest = async () => {
		await tick()
		const line = /** @type {HTMLElement | null | undefined} */ (
			log?.querySelector('[data-newest]')?.closest('[tabindex]')
		)
		line?.focus()
	}

	$effect(() => {
		const lines = current.bot.length
		if (step === firstStep || reducedMotion()) {
			revealed = lines
			if (step !== firstStep) focusNewest()
			return
		}
		revealed = 1
		focusNewest()
		const timer = setInterval(() => {
			revealed += 1
			if (revealed >= lines) clearInterval(timer)
		}, 900)
		return () => clearInterval(timer)
	})

	$effect(() => {
		if (feedback) focusNewest()
	})

	const shown = $derived(current.bot.slice(0, revealed))
	const ready = $derived(revealed >= current.bot.length)

	/** @type {import('$app/forms').SubmitFunction} */
	const submit = ({ submitter }) => {
		const label = submitter?.textContent?.trim()
		return async ({ update }) => {
			if (label) said[step] = label
			await update({ reset: false })
		}
	}
</script>

<div class="lesson-chat">
	<div
		class="lesson-log"
		role="log"
		aria-live="polite"
		aria-label="Lesson conversation"
		bind:this={log}
	>
		{#each history as item (item.step)}
			{#each item.bot as line, index (index)}
				<MascotSays size="2.75rem" face={index === item.bot.length - 1}>
					<p>{line}</p>
				</MascotSays>
			{/each}
			{#if said[item.step] ?? item.me}
				<p class="lesson-me">{said[item.step] ?? item.me}</p>
			{/if}
		{/each}

		{#each shown as line, index (`${step}-${index}`)}
			<div tabindex="-1" class="lesson-line">
				<MascotSays size="2.75rem" face={index === shown.length - 1}>
					<p data-newest={index === 0 ? '' : undefined}>{line}</p>
				</MascotSays>
			</div>
		{/each}

		{#if feedback && feedback.step === step}
			<p class="lesson-me">{feedback.label}</p>
			<div tabindex="-1" class="lesson-line">
				<MascotSays size="2.75rem">
					<p data-newest>{feedback.feedback}</p>
				</MascotSays>
			</div>
		{/if}
	</div>

	{#if ready}
		{#if last}
			<form class="lesson-answers" method="POST" action="?/finish">
				<button class="is-strong">Finish lesson</button>
			</form>
		{:else}
			<form class="lesson-answers" method="POST" action="?/answer" use:enhance={submit}>
				<input type="hidden" name="step" value={step} />
				<div role="group" aria-label="Your answer">
					{#each current.options as option, index (index)}
						<button name="option" value={index}>{option.label}</button>
					{/each}
				</div>
			</form>
		{/if}
	{/if}

	<p class="lesson-note">Guidance, not tax advice.</p>
</div>

<style>
	.lesson-chat {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
		max-inline-size: 51.25rem;
	}

	.lesson-log {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	.lesson-line:focus {
		outline: none;
	}

	.lesson-line:focus-visible {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}

	.lesson-me {
		align-self: flex-end;
		max-inline-size: 26rem;
		padding: var(--space-s) var(--space-m);
		border: var(--line);
		border-style: dashed;
		border-radius: 1.375rem 1.375rem 0.375rem 1.375rem;
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
	}

	.lesson-answers div,
	.lesson-answers {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.lesson-answers {
		padding-inline-start: calc(2.75rem + var(--space-s));
	}

	button {
		min-block-size: 3rem;
		padding-inline: var(--space-m);
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--color-text);
		font-family: inherit;
		font-size: var(--font-size-agenda-meta);
		font-weight: 800;
		cursor: pointer;
	}

	button:hover {
		text-decoration: underline;
	}

	button.is-strong {
		border: var(--line-strong);
		text-transform: uppercase;
	}

	.lesson-note {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}
</style>

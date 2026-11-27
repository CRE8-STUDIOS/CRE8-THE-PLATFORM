<script>
	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import AddSentence from '#lib/molecules/AddSentence.svelte'
	import { readAnswers, chosenDay } from '#lib/agenda/answers.js'
	import { describeAdd } from '#lib/agenda/fit.js'

	/**
	 * The step 2 shell: header, the questions of one type, extra options,
	 * and the mascot sentence with the big button. The sentence follows the
	 * answers live with JavaScript and comes from the server without it.
	 * @type {{
	 *   type: string,
	 *   heading: string,
	 *   action: string,
	 *   submitLabel: string,
	 *   answers: Record<string, string>,
	 *   errors?: Record<string, string>,
	 *   sentence?: string,
	 *   context: import('#lib/agenda/fit.js').FitContext,
	 *   changeTypeHref?: string | null,
	 *   closeHref: string,
	 *   onclose?: (event: MouseEvent) => void,
	 *   onchangetype?: (event: MouseEvent) => void,
	 *   questions: import('svelte').Snippet<[{ answers: Record<string, string>, errors: Record<string, string> }]>,
	 *   more?: import('svelte').Snippet<[{ answers: Record<string, string> }]>,
	 *   moreHint?: string,
	 *   before?: import('svelte').Snippet
	 * }}
	 */
	const {
		type,
		heading,
		action,
		submitLabel,
		answers: initialAnswers,
		errors: initialErrors = {},
		sentence: initialSentence,
		context: initialContext,
		changeTypeHref,
		closeHref,
		onclose,
		onchangetype,
		questions,
		more,
		moreHint = '',
		before
	} = $props()

	let answers = $state(untrack(() => initialAnswers))
	let errors = $state(untrack(() => initialErrors))
	let context = $state(untrack(() => initialContext))
	let live = $state(false)

	/** Days already fetched for the live sentence */
	const fetched = new Set()

	const sentence = $derived(
		live
			? describeAdd(type, answers, context)
			: (initialSentence ?? describeAdd(type, answers, context))
	)

	/** Picked days outside the loaded range get their items fetched */
	const ensureDay = async (/** @type {string | null} */ day) => {
		if (!day || fetched.has(day)) return
		fetched.add(day)
		const response = await fetch(`/agenda/add/day?date=${day}`)
		if (!response.ok) return
		const { items } = await response.json()
		const known = new Set(context.items.map((item) => `${item.id}${item.starts_at}`))
		context = {
			...context,
			items: [
				...context.items,
				...items.filter((/** @type {any} */ item) => !known.has(`${item.id}${item.starts_at}`))
			]
		}
	}

	const update = (/** @type {Event} */ event) => {
		const form = /** @type {HTMLFormElement} */ (event.currentTarget)
		answers = readAnswers(new FormData(form))
		live = true
		ensureDay(chosenDay(answers, context.today))
	}

	/** @type {import('$app/forms').SubmitFunction} */
	const submit =
		() =>
		async ({ result }) => {
			if (result.type === 'failure') {
				errors = /** @type {Record<string, string>} */ (result.data?.errors ?? {})
				live = true
				return
			}
			if (result.type === 'redirect') {
				await goto(result.location, { invalidateAll: true })
				return
			}
			if (result.type === 'error') errors = { form: 'Something went wrong. Try again.' }
		}
</script>

<div class="add-form">
	<div class="add-form-top">
		{#if changeTypeHref}
			<a class="add-form-change" href={changeTypeHref} onclick={onchangetype}>‹ Change type</a>
		{:else}
			<span></span>
		{/if}
		<a class="add-form-close" href={closeHref} aria-label="Close" onclick={onclose}>
			<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1 1 11" /></svg>
		</a>
	</div>

	<h1 class="add-form-heading">{heading}</h1>

	<form
		class="add-form-body"
		method="POST"
		{action}
		oninput={update}
		onchange={update}
		use:enhance={submit}
	>
		{@render before?.()}
		{@render questions({ answers, errors })}

		{#if more}
			<details class="add-form-more">
				<summary>
					+ More options {#if moreHint}<span>{moreHint}</span>{/if}
				</summary>
				<div class="add-form-more-body">{@render more({ answers })}</div>
			</details>
		{/if}

		{#if errors.form}<p class="add-form-error" role="alert">{errors.form}</p>{/if}

		<div class="add-form-bottom">
			<AddSentence {sentence} />
			<button class="add-form-submit">{submitLabel}</button>
		</div>
	</form>
</div>

<style>
	.add-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
		min-block-size: 100%;
	}

	.add-form-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.add-form-change {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text);
		font-size: var(--font-size-label);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.add-form-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: var(--size-touch);
		block-size: var(--size-touch);
		border: var(--line);
		border-radius: var(--radius-pill);
		color: var(--color-text);
	}

	.add-form-close svg {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}

	.add-form-heading {
		font-size: clamp(1.375rem, 1.2rem + 0.8vw, 1.625rem);
		line-height: 1.15;
		text-transform: uppercase;
	}

	.add-form-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-l);
	}

	.add-form-more {
		padding-block-start: var(--space-s);
		border-block-start: var(--line-quiet);
	}

	summary {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		min-block-size: var(--size-touch);
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
		cursor: pointer;
	}

	summary span {
		color: var(--color-text-calm);
		font-weight: 500;
		text-transform: none;
	}

	.add-form-more-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
		padding-block: var(--space-s);
	}

	.add-form-error {
		color: var(--color-error);
	}

	.add-form-bottom {
		position: sticky;
		inset-block-end: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		margin-block-start: auto;
		padding-block: var(--space-s);
		border-block-start: var(--line);
		background-color: var(--color-background);
	}

	.add-form-submit {
		min-block-size: 3.25rem;
		border: var(--line-strong);
		border-radius: var(--radius-pill);
		background: transparent;
		font-family: var(--font-family-display);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
		cursor: pointer;
	}

	.add-form-submit:hover {
		text-decoration: underline;
	}
</style>

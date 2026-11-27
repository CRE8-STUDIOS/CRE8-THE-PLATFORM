<script>
	/** @type {{ label: string, id: string, name: string, autocomplete?: 'current-password' | 'new-password', error?: string, hint?: string } & Omit<import('svelte/elements').HTMLInputAttributes, 'type'>} */
	const {
		label,
		id,
		name,
		autocomplete,
		error,
		hint,
		'aria-describedby': describedby,
		...rest
	} = $props()

	const hintId = $derived(hint ? `${id}-hint` : undefined)
	const described = $derived([describedby, error, hintId].filter(Boolean).join(' ') || undefined)

	let enhanced = $state(false)
	let visible = $state(false)

	/** @type {HTMLInputElement | undefined} */
	let input = $state()
	/** @type {HTMLButtonElement | undefined} */
	let button = $state()

	$effect(() => {
		enhanced = true
	})

	$effect(() => {
		const form = input?.form
		if (!form || !input) return
		const field = input

		const hide = () => {
			visible = false
			field.type = 'password'
		}

		form.addEventListener('submit', hide, true)
		return () => form.removeEventListener('submit', hide, true)
	})

	const toggle = () => {
		visible = !visible
		button?.focus()
	}
</script>

<div class="password-field">
	<label class="field-label" for={id}>{label}</label>
	<span class="password-input" class:enhanced>
		<input
			bind:this={input}
			{id}
			{name}
			{autocomplete}
			type={visible ? 'text' : 'password'}
			aria-describedby={described}
			aria-invalid={error ? 'true' : undefined}
			{...rest}
		/>
		{#if enhanced}
			<button
				bind:this={button}
				type="button"
				class="password-toggle"
				aria-label={visible ? 'Hide password' : 'Show password'}
				aria-controls={id}
				onclick={toggle}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					{#if visible}
						<ellipse class="eye-open" cx="12" cy="12" rx="6" ry="8.5" />
					{:else}
						<path class="eye-closed" d="M5 11 Q12 18.5 19 11" />
					{/if}
				</svg>
			</button>
		{/if}
	</span>
	{#if hint}<small id={hintId} class="password-hint">{hint}</small>{/if}
</div>

<style>
	.password-field {
		--password-toggle-size: 2.75rem;

		display: grid;
		gap: var(--space-2xs);
		inline-size: 100%;
		text-align: start;
	}

	.password-field .field-label,
	.password-hint {
		padding-inline-start: var(--space-s);
	}

	.password-hint {
		font-size: var(--font-size-small);
	}

	.password-input {
		position: relative;
		isolation: isolate;
		display: block;
	}

	.password-input::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: var(--radius-pill);
		background-color: var(--color-surface);
		filter: var(--rough-edge);
	}

	.password-input input {
		border: none;
		border-radius: var(--radius-pill);
		background-color: transparent;
		color: var(--color-text);
	}

	.enhanced input {
		padding-inline-end: calc(var(--password-toggle-size) + var(--space-2xs));
	}

	.password-toggle {
		position: absolute;
		inset-block: 0;
		inset-inline-end: 0;
		display: grid;
		place-items: center;
		inline-size: var(--password-toggle-size);
		min-block-size: var(--password-toggle-size);
		margin-block: auto;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: none;
		color: var(--color-text);
		cursor: pointer;
	}

	.password-toggle svg {
		inline-size: 1.5rem;
		block-size: 1.5rem;
		overflow: visible;
	}

	.eye-open {
		fill: var(--mascot-eye);
		stroke: var(--mascot-color);
		stroke-width: 2;
	}

	.eye-closed {
		fill: none;
		stroke: var(--mascot-color);
		stroke-width: 2.5;
		stroke-linecap: round;
	}

	.password-toggle:focus-visible {
		outline: var(--focus-outline);
		outline-offset: calc(var(--focus-offset) * -1);
	}
</style>

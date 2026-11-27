<script>
	/** @type {{ label: string, id: string, hint?: string } & import('svelte/elements').HTMLInputAttributes} */
	const { label, id, hint, 'aria-describedby': describedby, ...rest } = $props()

	const hintId = $derived(hint ? `${id}-hint` : undefined)
	const described = $derived([describedby, hintId].filter(Boolean).join(' ') || undefined)
</script>

<div class="auth-field">
	<label class="field-label" for={id}>{label}</label>
	<span class="auth-input">
		<input {id} aria-describedby={described} {...rest} />
	</span>
	{#if hint}<small id={hintId} class="auth-field-hint">{hint}</small>{/if}
</div>

<style>
	.auth-field {
		display: grid;
		gap: var(--space-2xs);
		inline-size: 100%;
		text-align: start;
	}

	.auth-field .field-label,
	.auth-field-hint {
		padding-inline-start: var(--space-s);
	}

	.auth-field-hint {
		font-size: var(--font-size-small);
	}

	.auth-input {
		position: relative;
		isolation: isolate;
		display: block;
	}

	.auth-input::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: var(--radius-pill);
		background-color: var(--color-surface);
		filter: var(--rough-edge);
	}

	.auth-input input {
		border: none;
		border-radius: var(--radius-pill);
		background-color: transparent;
		color: var(--color-text);
	}
</style>

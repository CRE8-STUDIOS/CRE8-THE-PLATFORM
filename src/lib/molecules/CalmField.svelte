<script>
	/**
	 * A labelled input in the calm style: a line, no fill.
	 * @type {{ label: string, name: string, error?: string, hint?: string, optional?: boolean, big?: boolean } & import('svelte/elements').HTMLInputAttributes}
	 */
	const {
		label,
		name,
		error,
		hint,
		optional = false,
		big = false,
		id = `field-${name}`,
		...rest
	} = $props()
</script>

<div class="calm-field" class:big>
	<label for={id}>
		{label}{#if optional}<span class="calm-field-optional"> optional</span>{/if}
	</label>
	<input
		{id}
		{name}
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
			undefined}
		{...rest}
	/>
	{#if hint}<p id="{id}-hint" class="calm-field-hint">{hint}</p>{/if}
	{#if error}<p id="{id}-error" class="calm-field-error">{error}</p>{/if}
</div>

<style>
	.calm-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		min-inline-size: 0;
	}

	label {
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	.calm-field-optional {
		color: var(--color-text-calm);
		font-weight: 500;
		text-transform: none;
	}

	input {
		min-block-size: var(--size-touch);
		padding-inline: var(--space-s);
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
	}

	.big input {
		min-block-size: 3.5rem;
		padding-inline: 0;
		border: 0;
		border-block-end: var(--line);
		border-radius: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.calm-field-hint {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.calm-field-error {
		color: var(--color-error);
		font-size: var(--font-size-label);
	}
</style>

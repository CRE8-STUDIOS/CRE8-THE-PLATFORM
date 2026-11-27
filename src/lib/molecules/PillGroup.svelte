<script>
	import PillRadio from '#lib/atoms/PillRadio.svelte'

	/**
	 * A question answered with tap pills, with an optional hint, error and extra field.
	 * @type {{
	 *   legend: string,
	 *   name: string,
	 *   options: { value: string, label: string }[],
	 *   value?: string,
	 *   hint?: string,
	 *   error?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	const { legend, name, options, value, hint, error, children } = $props()
</script>

<fieldset class="pill-group" class:invalid={error}>
	<legend>{legend}</legend>
	<div class="pill-group-options">
		{#each options as option (option.value)}
			<PillRadio {name} value={option.value} checked={option.value === value}>
				{option.label}
			</PillRadio>
		{/each}
	</div>
	{@render children?.()}
	{#if error}<p class="pill-group-error" role="alert">{error}</p>{/if}
	{#if hint}<p class="pill-group-hint">{hint}</p>{/if}
</fieldset>

<style>
	.pill-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		margin-block-end: var(--space-xs);
		padding: 0;
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	.pill-group-options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.pill-group-hint {
		color: var(--color-text-calm);
		font-size: var(--font-size-label);
	}

	.pill-group-error {
		color: var(--color-error);
		font-size: var(--font-size-label);
	}
</style>

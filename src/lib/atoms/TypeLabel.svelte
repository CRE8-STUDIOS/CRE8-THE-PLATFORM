<script>
	/** @type {{ children: import('svelte').Snippet }} */
	const { children } = $props()
</script>

<span class="type-label">{@render children()}</span>

<style>
	.type-label {
		flex: none;
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}
</style>

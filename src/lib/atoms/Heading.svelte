<script>
	/** @type {{ level?: 1 | 2 | 3 | 4, children: import('svelte').Snippet }} */
	const { level = 2, children } = $props()
</script>

<svelte:element this={`h${level}`} class="heading heading-{level}">
	{@render children()}
</svelte:element>

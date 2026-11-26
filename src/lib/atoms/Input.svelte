<script>
	/** @type {import('svelte/elements').HTMLInputAttributes} */
	const { ...rest } = $props()
</script>

<input class="input" {...rest} />

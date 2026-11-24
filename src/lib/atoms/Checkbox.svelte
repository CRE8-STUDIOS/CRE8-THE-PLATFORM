<script>
	/** @type {import('svelte/elements').HTMLInputAttributes} */
	const { ...rest } = $props()
</script>

<input type="checkbox" class="checkbox" {...rest} />

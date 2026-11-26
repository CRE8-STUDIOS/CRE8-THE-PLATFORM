<script>
	/** @type {import('svelte/elements').HTMLTextareaAttributes} */
	const { rows = 4, ...rest } = $props()
</script>

<textarea class="textarea" {rows} {...rest}></textarea>

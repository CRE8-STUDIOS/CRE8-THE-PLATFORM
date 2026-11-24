<script>
	/**
	 * A text-like input (text, email, password, date, time, number, file, hidden...).
	 * @type {import('svelte/elements').HTMLInputAttributes}
	 */
	const { ...rest } = $props()
</script>

<input class="input" {...rest} />

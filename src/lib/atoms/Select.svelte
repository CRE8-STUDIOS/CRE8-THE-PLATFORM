<script>
	/**
	 * A dropdown. `options` are { value, label } pairs; `empty` adds a first "nothing chosen" option.
	 * @type {{ options: { value: string, label: string }[], value?: string | null, empty?: string } & import('svelte/elements').HTMLSelectAttributes}
	 */
	const { options, value = '', empty, ...rest } = $props()
</script>

<select class="select" {...rest}>
	{#if empty !== undefined}
		<option value="">{empty}</option>
	{/if}
	{#each options as option (option.value)}
		<option value={option.value} selected={option.value === (value ?? '')}>{option.label}</option>
	{/each}
</select>

<script>
	import Select from '#lib/atoms/Select.svelte'

	/** @type {{ label: string, hint?: string, options: { value: string, label: string }[], value?: string | null, empty?: string } & import('svelte/elements').HTMLSelectAttributes} */
	const { label, hint, ...rest } = $props()
</script>

<label class="field">
	<span class="field-label">{label}</span>
	<Select {...rest} />
	{#if hint}<small class="field-hint">{hint}</small>{/if}
</label>

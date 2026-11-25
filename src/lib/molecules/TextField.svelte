<script>
	import Input from '#lib/atoms/Input.svelte'

	/** @type {{ label: string, hint?: string } & import('svelte/elements').HTMLInputAttributes} */
	const { label, hint, ...rest } = $props()
</script>

<label class="field">
	<span class="field-label">{label}</span>
	<Input {...rest} />
	{#if hint}<small class="field-hint">{hint}</small>{/if}
</label>

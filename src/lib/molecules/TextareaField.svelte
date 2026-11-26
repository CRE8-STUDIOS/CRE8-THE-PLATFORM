<script>
	import Textarea from '#lib/atoms/Textarea.svelte'

	/** @type {{ label: string, hint?: string } & import('svelte/elements').HTMLTextareaAttributes} */
	const { label, hint, ...rest } = $props()
</script>

<label class="field">
	<span class="field-label">{label}</span>
	<Textarea {...rest} />
	{#if hint}<small class="field-hint">{hint}</small>{/if}
</label>

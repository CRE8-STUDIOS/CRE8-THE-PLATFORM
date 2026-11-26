<script>
	import Checkbox from '#lib/atoms/Checkbox.svelte'

	/** @type {{ label: string } & import('svelte/elements').HTMLInputAttributes} */
	const { label, ...rest } = $props()
</script>

<label class="field field-checkbox">
	<Checkbox {...rest} />
	<span class="field-label">{label}</span>
</label>

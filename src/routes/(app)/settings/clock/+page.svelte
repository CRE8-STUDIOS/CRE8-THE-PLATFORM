<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ClockSettingsForm from '#lib/organisms/ClockSettingsForm.svelte'

	const { data, form } = $props()
	const { settings } = $derived(data)
</script>

<FormNotice {form} />
{#if settings}<ClockSettingsForm {settings} />{/if}

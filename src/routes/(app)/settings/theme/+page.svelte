<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ThemeForm from '#lib/organisms/ThemeForm.svelte'

	const { data, form } = $props()
	const { theme } = $derived(data)
</script>

<FormNotice {form} />
<ThemeForm {theme} />

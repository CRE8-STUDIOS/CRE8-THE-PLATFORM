<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import TaxRules from '#lib/organisms/TaxRules.svelte'

	const { data, form } = $props()
	const { rules, year } = $derived(data)
</script>

<FormNotice {form} />
<TaxRules {rules} {year} />

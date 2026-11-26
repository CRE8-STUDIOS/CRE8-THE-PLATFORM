<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import TemplateList from '#lib/organisms/TemplateList.svelte'
	import TemplateForm from '#lib/organisms/TemplateForm.svelte'

	const { data, form } = $props()
	const { templates } = $derived(data)
</script>

<FormNotice {form} />
<TemplateList {templates} />
<TemplateForm title="New template" action="?/add" submitLabel="Add template" />

<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import WorkingHoursList from '#lib/organisms/WorkingHoursList.svelte'
	import WorkingHoursForm from '#lib/organisms/WorkingHoursForm.svelte'

	const { data, form } = $props()
	const { groups, kinds } = $derived(data)
</script>

<FormNotice {form} />
<WorkingHoursList {groups} />
<WorkingHoursForm {kinds} />

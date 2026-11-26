<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import PortalAccess from '#lib/organisms/PortalAccess.svelte'

	const { data, form } = $props()
	const { access, signupLink, project, timezone } = $derived(data)
</script>

<FormNotice {form} />
<PortalAccess
	{access}
	{signupLink}
	clientEmail={project.clients?.email ?? ''}
	timeZone={timezone}
/>

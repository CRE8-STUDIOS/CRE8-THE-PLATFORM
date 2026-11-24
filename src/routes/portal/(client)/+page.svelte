<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import PortalProjectList from '#lib/organisms/PortalProjectList.svelte'

	const { data } = $props()
	const { projects } = $derived(data)
</script>

<PageHeader title="My projects" />
<PortalProjectList {projects} />

<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ClientForm from '#lib/organisms/ClientForm.svelte'
	import LinkList from '#lib/organisms/LinkList.svelte'
	import ArchiveOrDelete from '#lib/organisms/ArchiveOrDelete.svelte'

	const { data, form } = $props()
	const { client, projectLinks } = $derived(data)
</script>

<PageHeader
	title={client.name}
	back={{ href: '/clients', text: 'Clients' }}
	intro={client.archived_at ? 'Archived' : undefined}
/>
<div class="card-grid">
	<ClientForm title="Details" action="?/update" submitLabel="Save" {client} {form} />
	<LinkList title="Projects" links={projectLinks} empty="No projects yet." />
	<ArchiveOrDelete
		archived={Boolean(client.archived_at)}
		what="client"
		note="Clients with active projects or sent facturen can only be archived."
	/>
</div>

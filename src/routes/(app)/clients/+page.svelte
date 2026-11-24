<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ClientList from '#lib/organisms/ClientList.svelte'
	import ClientForm from '#lib/organisms/ClientForm.svelte'

	const { data, form } = $props()
	const { clients, showArchived } = $derived(data)
</script>

<PageHeader title="Clients" />
<ClientList {clients} {showArchived} />
<ClientForm title="New client" action="?/create" submitLabel="Add client" {form} />

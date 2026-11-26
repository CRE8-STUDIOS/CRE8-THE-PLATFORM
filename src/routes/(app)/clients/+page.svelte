<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ClientList from '#lib/organisms/ClientList.svelte'
	import ClientForm from '#lib/organisms/ClientForm.svelte'

	const { data, form } = $props()
	const { clients, showArchived } = $derived(data)
</script>

<PageHeader title="Clients">
	{#snippet actions()}
		<a class="button button-primary" href="#new-client">+ New client</a>
	{/snippet}
</PageHeader>

<div class="card-grid">
	<ClientList {clients} {showArchived} />
	<ClientForm
		id="new-client"
		title="New client"
		action="?/create"
		submitLabel="Add client"
		{form}
	/>
</div>

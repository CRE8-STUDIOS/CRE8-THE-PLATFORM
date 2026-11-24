<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import NewContract from '#lib/organisms/NewContract.svelte'
	import ContractEditor from '#lib/organisms/ContractEditor.svelte'
	import SignedContract from '#lib/organisms/SignedContract.svelte'

	const { data, form } = $props()
	const { contract, templates, project, timezone } = $derived(data)
</script>

<FormNotice {form} />
{#if !contract}
	<NewContract {templates} />
{:else if contract.status === 'signed'}
	<SignedContract {contract} timeZone={timezone} projectId={project.id} />
{:else}
	<ContractEditor
		{contract}
		timeZone={timezone}
		projectId={project.id}
		hasClient={Boolean(project.client_id)}
	/>
{/if}

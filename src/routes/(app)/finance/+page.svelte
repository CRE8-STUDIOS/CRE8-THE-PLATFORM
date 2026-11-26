<script>
	import FinanceHeader from '#lib/organisms/FinanceHeader.svelte'
	import BtwGuidance from '#lib/organisms/BtwGuidance.svelte'
	import InvoiceList from '#lib/organisms/InvoiceList.svelte'
	import NewInvoiceForm from '#lib/organisms/NewInvoiceForm.svelte'

	const { data, form } = $props()
	const { projectId, quarter, invoices, clients, projects } = $derived(data)
</script>

<FinanceHeader
	current="/finance"
	back={projectId ? { href: `/projects/${projectId}`, text: 'the project' } : undefined}
>
	{#snippet actions()}
		<a class="button button-primary" href="#new-factuur">+ New factuur</a>
	{/snippet}
</FinanceHeader>

<div class="card-grid">
	<InvoiceList {invoices} />
	{#if !projectId}<BtwGuidance {quarter} />{/if}
	<NewInvoiceForm id="new-factuur" {clients} {projects} {projectId} {form} />
</div>

<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'
	import BtwGuidance from '#lib/organisms/BtwGuidance.svelte'
	import InvoiceList from '#lib/organisms/InvoiceList.svelte'
	import NewInvoiceForm from '#lib/organisms/NewInvoiceForm.svelte'

	const { data, form } = $props()
	const { projectId, quarter, invoices, clients, projects } = $derived(data)

	const links = [
		{ href: '/finance', text: 'Facturen' },
		{ href: '/finance/expenses', text: 'Expenses' }
	]
</script>

<PageHeader
	title="Finance"
	back={projectId ? { href: `/projects/${projectId}`, text: 'the project' } : undefined}
/>
<NavLinks label="Finance" {links} current="/finance" exact />
{#if !projectId}<BtwGuidance {quarter} />{/if}
<InvoiceList {invoices} />
<NewInvoiceForm {clients} {projects} {projectId} {form} />

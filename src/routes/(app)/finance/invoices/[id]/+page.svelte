<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import InvoiceSettings from '#lib/organisms/InvoiceSettings.svelte'
	import InvoiceDetails from '#lib/organisms/InvoiceDetails.svelte'
	import InvoiceLines from '#lib/organisms/InvoiceLines.svelte'
	import InvoiceActions from '#lib/organisms/InvoiceActions.svelte'

	const { data, form } = $props()
	const { invoice, lines, project, clients, openRequests, timezone } = $derived(data)
	const isDraft = $derived(invoice.status === 'draft')
</script>

<PageHeader
	title={`Factuur ${invoice.invoice_number ?? '(draft)'}${invoice.credits_invoice_id ? ' · credit factuur' : ''}`}
	back={{ href: '/finance', text: 'Finance' }}
/>
<div class="card-grid">
	<FormNotice {form} />
	{#if isDraft}
		<InvoiceSettings {invoice} {clients} />
	{:else}
		<InvoiceDetails {invoice} {project} timeZone={timezone} />
	{/if}
	<InvoiceLines {lines} {invoice} editable={isDraft} {openRequests} />
	<InvoiceActions
		status={invoice.status ?? 'draft'}
		isCredit={Boolean(invoice.credits_invoice_id)}
	/>
</div>

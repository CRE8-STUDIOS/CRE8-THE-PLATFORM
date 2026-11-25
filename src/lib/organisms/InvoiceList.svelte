<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/** @type {{ invoices: { id: string | null, invoice_number: string | null, status: string | null, total: number | null, is_overdue: boolean | null, days_overdue: number | null, credits_invoice_id: string | null, clientName: string }[] }} */
	const { invoices } = $props()
</script>

<section class="invoice-list">
	<Heading>Facturen</Heading>
	<ul>
		{#each invoices as { id, invoice_number, status, total, is_overdue, days_overdue, credits_invoice_id, clientName } (id)}
			<li>
				<a href="/finance/invoices/{id}">{invoice_number ?? 'Draft'}</a>
				· {clientName} · <Money value={total} />
				<StatusLabel status={is_overdue ? 'overdue' : (status ?? 'draft')} />
				{#if is_overdue}({days_overdue} days){/if}
				{#if credits_invoice_id}· credit factuur{/if}
			</li>
		{:else}
			<li>No facturen yet.</li>
		{/each}
	</ul>
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/**
	 * @type {{
	 *   invoice: { status: string | null, is_overdue: boolean | null, days_overdue: number | null, issue_date: string | null, due_date: string | null, sent_at: string | null, paid_at: string | null, notes: string | null, credits_invoice_id: string | null, issuer_details: unknown, client_details: unknown },
	 *   project: { id: string, title: string } | null,
	 *   timeZone: string
	 * }}
	 */
	const { invoice, project, timeZone } = $props()

	/** @type {Record<string, string | null>} */
	const from = $derived(/** @type {any} */ (invoice.issuer_details) ?? {})
	/** @type {Record<string, string | null>} */
	const to = $derived(/** @type {any} */ (invoice.client_details) ?? {})
</script>

<section class="invoice-details">
	<Heading>Details</Heading>
	<p>
		<StatusLabel status={invoice.is_overdue ? 'overdue' : (invoice.status ?? 'sent')} />
		{#if invoice.is_overdue}({invoice.days_overdue} days){/if}
		{#if project}· Project: <a href="/projects/{project.id}">{project.title}</a>{/if}
		{#if invoice.credits_invoice_id}· Corrects <a
				href="/finance/invoices/{invoice.credits_invoice_id}"
			>
				this factuur
			</a>{/if}
	</p>
	<dl>
		<dt>From</dt>
		<dd>
			{from.business_name ?? from.name}<br />
			{from.street}
			{from.postal_code}
			{from.city}<br />
			KvK {from.kvk_number ?? 'none'} · Btw {from.btw_number ?? 'none'} · IBAN {from.iban ?? 'none'}
		</dd>
		<dt>To</dt>
		<dd>
			{to.company ?? to.name}<br />
			{to.street}
			{to.postal_code}
			{to.city}
			{to.country}
			{#if to.btw_number}<br />Btw {to.btw_number}{/if}
		</dd>
		<dt>Dates</dt>
		<dd>
			Issued {invoice.issue_date} · due {invoice.due_date} · sent <DateTime
				value={invoice.sent_at}
				{timeZone}
			/>
			{#if invoice.paid_at}· paid <DateTime value={invoice.paid_at} {timeZone} />{/if}
		</dd>
	</dl>
	{#if invoice.notes}<p>{invoice.notes}</p>{/if}
</section>

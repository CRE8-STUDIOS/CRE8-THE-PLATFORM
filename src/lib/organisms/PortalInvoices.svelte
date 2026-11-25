<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/**
	 * @type {{
	 *   invoices: { id: string | null, invoice_number: string | null, status: string | null, issue_date: string | null, due_date: string | null, subtotal: number | null, vat_total: number | null, total: number | null, is_overdue: boolean | null,
	 *     lines: { id: string, description: string, quantity: number, unit_price: number, vat_rate: number }[] }[]
	 * }}
	 */
	const { invoices } = $props()
</script>

<section class="portal-invoices card rough-edge">
	<Heading>Facturen</Heading>
	{#each invoices as { id, invoice_number, status, issue_date, due_date, subtotal, vat_total, total, is_overdue, lines } (id)}
		<article class="portal-invoices-item">
			<Heading level={3}>Factuur {invoice_number}</Heading>
			<p>
				<StatusLabel status={status === 'paid' ? 'paid' : is_overdue ? 'overdue' : 'open'} /> · issued
				{issue_date} · due {due_date}
			</p>
			<ul>
				{#each lines as { id: lineId, description, quantity, unit_price, vat_rate } (lineId)}
					<li>{description} · {quantity} × <Money value={unit_price} /> ({vat_rate}% btw)</li>
				{/each}
			</ul>
			<p>
				Subtotal <Money value={subtotal} /> · btw <Money value={vat_total} /> ·
				<strong>total <Money value={total} /></strong>
			</p>
		</article>
	{:else}
		<p>No facturen yet.</p>
	{/each}
</section>

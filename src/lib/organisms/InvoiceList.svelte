<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/** @type {{ invoices: { id: string | null, invoice_number: string | null, status: string | null, total: number | null, is_overdue: boolean | null, days_overdue: number | null, credits_invoice_id: string | null, clientName: string }[] }} */
	const { invoices } = $props()
</script>

<section class="invoice-list card rough-edge span-full">
	<Heading>Facturen</Heading>
	{#if invoices.length}
		<div class="table-scroll">
			<table>
				<thead>
					<tr>
						<th scope="col">Number</th>
						<th scope="col">Client</th>
						<th scope="col" class="number">Total</th>
						<th scope="col">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each invoices as { id, invoice_number, status, total, is_overdue, days_overdue, credits_invoice_id, clientName } (id)}
						<tr>
							<td>
								<a href="/finance/invoices/{id}">{invoice_number ?? 'Draft'}</a>
								{#if credits_invoice_id}<span class="text-small text-muted">
										credit factuur
									</span>{/if}
							</td>
							<td>{clientName}</td>
							<td class="number"><Money value={total} /></td>
							<td>
								<StatusLabel status={is_overdue ? 'overdue' : (status ?? 'draft')} />
								{#if is_overdue}<span class="text-small text-muted">{days_overdue} days</span>{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-muted">No facturen yet.</p>
	{/if}
</section>

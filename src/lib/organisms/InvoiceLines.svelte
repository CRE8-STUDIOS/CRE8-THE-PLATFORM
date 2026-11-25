<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import { VAT_RATES, toOptions } from '#lib/utils/constants.js'

	/**
	 * @type {{
	 *   lines: { id: string, description: string, quantity: number, unit_price: number, vat_rate: number, amount: number }[],
	 *   invoice: { subtotal: number | null, vat_total: number | null, total: number | null, vat_treatment: string | null },
	 *   editable: boolean,
	 *   openRequests?: { id: string, title: string, price: number | null }[]
	 * }}
	 */
	const { lines, invoice, editable, openRequests = [] } = $props()
</script>

<section class="invoice-lines">
	<Heading>Lines</Heading>
	<table>
		<thead>
			<tr>
				<th scope="col">Description</th><th scope="col">Qty</th><th scope="col">Price</th><th
					scope="col"
				>
					Btw
				</th><th scope="col">Amount</th>{#if editable}<th scope="col">
						<span class="visually-hidden">Remove</span>
					</th>{/if}
			</tr>
		</thead>
		<tbody>
			{#each lines as { id, description, quantity, unit_price, vat_rate, amount } (id)}
				<tr>
					<td>{description}</td>
					<td>{quantity}</td>
					<td><Money value={unit_price} /></td>
					<td>{vat_rate}%</td>
					<td><Money value={amount} /></td>
					{#if editable}<td>
							<ActionButton action="?/removeLine" label="Remove" fields={{ id }} />
						</td>{/if}
				</tr>
			{:else}
				<tr><td colspan="5">No lines yet.</td></tr>
			{/each}
		</tbody>
		<tfoot>
			<tr><th scope="row" colspan="4">Subtotal</th><td><Money value={invoice.subtotal} /></td></tr>
			<tr>
				<th scope="row" colspan="4">
					Btw{#if invoice.vat_treatment !== 'standard'}
						({invoice.vat_treatment?.replaceAll('_', ' ')}){/if}
				</th><td><Money value={invoice.vat_total} /></td>
			</tr>
			<tr>
				<th scope="row" colspan="4">Total</th><td>
					<strong><Money value={invoice.total} /></strong>
				</td>
			</tr>
		</tfoot>
	</table>

	{#if editable}
		<Heading level={3}>Add a line</Heading>
		<form method="POST" action="?/addLine">
			<TextField label="Description" name="description" required />
			<TextField label="Quantity" name="quantity" value="1" inputmode="decimal" />
			<TextField label="Price excl. btw (€)" name="unit_price" inputmode="decimal" required />
			<SelectField label="Btw rate (%)" name="vat_rate" options={toOptions(VAT_RATES)} value="21" />
			<Button>Add line</Button>
		</form>

		{#if openRequests.length}
			<Heading level={3}>Approved requests not yet billed</Heading>
			<ul>
				{#each openRequests as { id, title, price } (id)}
					<li>
						{title} · <Money value={price} />
						<ActionButton
							action="?/addRequestLine"
							label="Add as line"
							fields={{ request_id: id }}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</section>

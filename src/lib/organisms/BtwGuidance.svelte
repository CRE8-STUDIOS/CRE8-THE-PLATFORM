<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'

	/** @type {{ quarter: { label: string, revenue: number, btwCharged: number, costs: number, btwPaid: number, btwToPay: number } }} */
	const { quarter } = $props()
</script>

<section class="btw-guidance card rough-edge">
	<Heading>Btw guidance · {quarter.label}</Heading>
	<p class="text-muted">
		<small>
			Based on facturen sent and expenses in CRE8. Guidance only: you file the aangifte yourself.
		</small>
	</p>
	<dl class="amount-list">
		<dt>Revenue (excl. btw)</dt>
		<dd><Money value={quarter.revenue} /></dd>
		<dt>Btw charged on your facturen</dt>
		<dd><Money value={quarter.btwCharged} /></dd>
		<dt>Costs (excl. btw)</dt>
		<dd><Money value={quarter.costs} /></dd>
		<dt>Btw paid on costs</dt>
		<dd><Money value={quarter.btwPaid} /></dd>
		<dt>Btw to pay this quarter (estimate)</dt>
		<dd><Money value={quarter.btwToPay} /></dd>
	</dl>
</section>

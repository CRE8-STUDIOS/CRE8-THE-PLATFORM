<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'

	/**
	 * Btw estimate for this quarter, based on facturen and expenses in CRE8.
	 * @type {{ quarter: { label: string, revenue: number, btwCharged: number, costs: number, btwPaid: number, btwToPay: number } }}
	 */
	const { quarter } = $props()
</script>

<section class="btw-guidance">
	<Heading>Btw guidance · {quarter.label}</Heading>
	<p>
		<small>
			Based on facturen sent and expenses in CRE8. Guidance only: you file the aangifte yourself.
		</small>
	</p>
	<dl>
		<dt>Revenue (excl. btw)</dt>
		<dd><Money value={quarter.revenue} /></dd>
		<dt>Btw charged on your facturen</dt>
		<dd><Money value={quarter.btwCharged} /></dd>
		<dt>Costs (excl. btw)</dt>
		<dd><Money value={quarter.costs} /></dd>
		<dt>Btw paid on costs</dt>
		<dd><Money value={quarter.btwPaid} /></dd>
		<dt><strong>Btw to pay this quarter (estimate)</strong></dt>
		<dd><strong><Money value={quarter.btwToPay} /></strong></dd>
	</dl>
</section>

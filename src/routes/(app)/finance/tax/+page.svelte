<!-- Placeholder page: the data is connected later. -->
<script>
	import FinanceHeader from '#lib/organisms/FinanceHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'

	const vatBoxes = [
		{ code: '1a', text: 'Sales taxed at 21%' },
		{ code: '1b', text: 'Sales taxed at 9%' },
		{ code: '3b', text: 'Supplies to other EU countries' },
		{ code: '5b', text: 'Input tax (btw you paid)' }
	]
	const deductions = ['Zelfstandigenaftrek', 'Startersaftrek', 'MKB winstvrijstelling']
</script>

<FinanceHeader current="/finance/tax" />

<div class="card-grid">
	<Card title="VAT return" label="[Quarter]">
		<dl class="amount-list">
			{#each vatBoxes as { code, text } (code)}
				<dt><span class="vat-code">{code}</span> {text}</dt>
				<dd>[Amount]</dd>
			{/each}
			<dt>Total to pay</dt>
			<dd>[Amount]</dd>
		</dl>
	</Card>

	<Card title="Income tax" label="[Year]">
		<dl class="amount-list">
			<dt>Profit</dt>
			<dd>[Amount]</dd>
			<dt>Deductions</dt>
			<dd>[Amount]</dd>
			<dt>Estimated income tax</dt>
			<dd>[Amount]</dd>
		</dl>
	</Card>

	<Card title="Deductions">
		<ul class="card-list">
			{#each deductions as deduction (deduction)}
				<li>
					{deduction}
					<span class="list-end">[Amount]</span>
				</li>
			{/each}
		</ul>
	</Card>

	<Card title="Reminders">
		<ul class="card-list">
			<li>[Reminder] <span class="list-end text-small text-muted">[Date]</span></li>
			<li>[Reminder] <span class="list-end text-small text-muted">[Date]</span></li>
		</ul>
	</Card>
</div>

<p class="text-small text-muted">
	Guidance only: you file the aangifte yourself. Check the numbers with the Belastingdienst or your
	accountant.
</p>

<style>
	.vat-code {
		display: inline-block;
		min-inline-size: 2em;
		font-family: var(--font-family-display);
	}
</style>

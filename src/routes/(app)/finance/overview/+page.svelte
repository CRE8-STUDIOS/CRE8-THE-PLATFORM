<!-- Placeholder page: the data is connected later. -->
<script>
	import FinanceHeader from '#lib/organisms/FinanceHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'
	import StatCard from '#lib/molecules/StatCard.svelte'

	const stats = ['Income', 'Costs', 'Profit', 'Keep aside for tax']
	const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
</script>

<FinanceHeader current="/finance/overview" />

<div class="card-grid stat-grid">
	{#each stats as label (label)}
		<StatCard {label} value="[Amount]" note="[This year]" />
	{/each}
</div>

<Card title="Per month">
	<ol class="bar-chart" aria-label="Income per month, no data yet">
		{#each months as month, index (index)}
			<li class="bar-chart-month">
				<span class="bar-chart-bar" aria-hidden="true"></span>
				<span class="bar-chart-label">{month}</span>
			</li>
		{/each}
	</ol>
	<p class="text-small text-muted">
		[The chart fills in once facturen and expenses are connected.]
	</p>
</Card>

<style>
	.stat-grid {
		--grid-min: var(--size-grid-s);
	}

	.bar-chart {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: var(--space-xs);
		padding: 0;
		list-style: none;
	}

	.bar-chart-month {
		display: grid;
		gap: var(--space-2xs);
		justify-items: center;
	}

	.bar-chart-bar {
		inline-size: 100%;
		block-size: var(--size-bar-chart);
		border: var(--border-width-thin) dashed var(--color-border);
		border-radius: var(--radius-small);
	}

	.bar-chart-label {
		color: var(--color-text-muted);
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
	}
</style>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ expenses: { id: string, date: string, supplier: string | null, amount_excl_vat: number, vat_amount: number, category: string | null, receiptUrl: string | null, projects: { title: string } | null }[] }} */
	const { expenses } = $props()
</script>

<section class="expense-list">
	<Heading>All expenses</Heading>
	<ul>
		{#each expenses as { id, date, supplier, amount_excl_vat, vat_amount, category, receiptUrl, projects } (id)}
			<li>
				{date} · {supplier ?? 'none'} · <Money value={amount_excl_vat} /> + btw <Money
					value={vat_amount}
				/>
				{#if category}· {category}{/if}
				{#if projects}· {projects.title}{/if}
				{#if receiptUrl}· <a href={receiptUrl} target="_blank" rel="noopener">receipt</a>{/if}
				<ActionButton
					action="?/delete"
					label="Delete"
					variant="danger"
					fields={{ id }}
					confirm="Delete this expense?"
				/>
			</li>
		{:else}
			<li>No expenses yet.</li>
		{/each}
	</ul>
</section>

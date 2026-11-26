<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ expenses: { id: string, date: string, supplier: string | null, amount_excl_vat: number, vat_amount: number, category: string | null, receiptUrl: string | null, projects: { title: string } | null }[] }} */
	const { expenses } = $props()
</script>

<section class="expense-list card rough-edge">
	<Heading>All expenses</Heading>
	<ul>
		{#each expenses as { id, date, supplier, amount_excl_vat, vat_amount, category, receiptUrl, projects } (id)}
			<li>
				<span class="expense-text">
					<span>{supplier ?? 'none'}</span>
					<span class="text-small text-muted">
						{date}{#if category}
							· {category}{/if}{#if projects}
							· {projects.title}{/if}{#if receiptUrl}
							· <a href={receiptUrl} target="_blank" rel="noopener">receipt</a>{/if}
					</span>
				</span>
				<span class="list-end number">
					<Money value={amount_excl_vat} /> + btw <Money value={vat_amount} />
				</span>
				<ActionButton
					action="?/delete"
					label="Delete"
					variant="danger"
					fields={{ id }}
					confirm="Delete this expense?"
				/>
			</li>
		{:else}
			<li class="text-muted">No expenses yet.</li>
		{/each}
	</ul>
</section>

<style>
	.expense-text {
		display: grid;
		flex: 1 1 var(--size-grid-s);
	}
</style>

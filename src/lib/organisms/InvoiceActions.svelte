<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ status: string, isCredit: boolean }} */
	const { status, isCredit } = $props()
</script>

<section class="invoice-actions card rough-edge">
	{#if status === 'draft'}
		<Heading>Send</Heading>
		<ActionButton
			action="?/send"
			label="Send factuur"
			variant="primary"
			confirm="Send this factuur? It gets a number and is locked after this."
		/>
		<ActionButton
			action="?/delete"
			label="Delete draft"
			variant="danger"
			confirm="Delete this draft?"
		/>
	{:else}
		<Heading>Payment</Heading>
		{#if status === 'sent'}
			<ActionButton action="?/markPaid" label="Mark as paid" variant="primary" />
		{:else}
			<ActionButton action="?/markUnpaid" label="Mark as unpaid" />
		{/if}
		{#if !isCredit}
			<Heading level={3}>Correct this factuur</Heading>
			<ActionButton
				action="?/createCredit"
				label="Make a credit factuur"
				confirm="Make a credit factuur for this one?"
			/>
		{/if}
	{/if}
</section>

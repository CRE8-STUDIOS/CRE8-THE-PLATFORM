<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ what: string, archived?: boolean, note?: string }} */
	const { what, archived, note } = $props()
</script>

<section class="archive-or-delete">
	<Heading>{archived === undefined ? 'Delete' : 'Archive or delete'}</Heading>
	{#if archived === true}
		<ActionButton action="?/unarchive" label="Make active again" />
	{:else if archived === false}
		<ActionButton action="?/archive" label="Archive {what}" />
	{/if}
	<ActionButton
		action="?/delete"
		label="Delete {what}"
		variant="danger"
		confirm="Delete this {what} for good?"
	/>
	{#if note}<p><small>{note}</small></p>{/if}
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import Notice from '#lib/atoms/Notice.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ contract: { title: string, body: string, status: string, sent_at: string | null }, timeZone: string, projectId: string, hasClient: boolean }} */
	const { contract, timeZone, projectId, hasClient } = $props()
</script>

<section class="contract-editor card rough-edge">
	<Heading>Contract</Heading>
	<p>
		<StatusLabel status={contract.status} />
		{#if contract.sent_at}· sent <DateTime value={contract.sent_at} {timeZone} />{/if}
	</p>
	<form method="POST" action="?/save">
		<TextField label="Title" name="title" value={contract.title} />
		<TextareaField label="Text" name="body" rows={16} value={contract.body} />
		<Button variant="primary">Save</Button>
	</form>

	{#if contract.status === 'draft'}
		<ActionButton action="?/send" label="Send to client for signing" variant="primary" />
		<ActionButton
			action="?/delete"
			label="Delete contract"
			variant="danger"
			confirm="Delete this contract?"
		/>
	{:else}
		<ActionButton action="?/withdraw" label="Withdraw (back to draft)" />
	{/if}

	{#if !hasClient}
		<Notice>
			Add a client to this project and invite them in the <a href="/projects/{projectId}/portal">
				client portal
			</a> so they can sign.
		</Notice>
	{/if}
</section>

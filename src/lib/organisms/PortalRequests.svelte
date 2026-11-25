<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import SignatureField from '#lib/molecules/SignatureField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ requests: { id: string, title: string, description: string | null, price: number | null, estimated_hours: number | null, status: string }[] }} */
	const { requests } = $props()
</script>

<section class="portal-requests">
	<Heading>Requests (extra work)</Heading>
	{#each requests as { id, title, description, price, estimated_hours, status } (id)}
		<article class="portal-requests-item">
			<Heading level={3}>{title}</Heading>
			<p><StatusLabel status={status === 'requested' ? 'waiting for a price' : status} /></p>
			{#if description}<p>{description}</p>{/if}
			{#if status !== 'requested'}
				<p>
					Price: <Money value={price} />{#if estimated_hours}
						· about {estimated_hours} h{/if}
				</p>
			{/if}
			{#if status === 'sent'}
				<form method="POST" action="?/approveRequest">
					<Input type="hidden" name="request_id" value={id} />
					<SignatureField label="Draw your signature to approve" />
					<Button variant="primary">Approve and sign</Button>
				</form>
				<ActionButton
					action="?/declineRequest"
					label="Decline"
					fields={{ request_id: id }}
					confirm="Decline this request?"
				/>
			{/if}
		</article>
	{:else}
		<p>No requests.</p>
	{/each}

	<Heading level={3}>Ask for extra work</Heading>
	<form method="POST" action="?/createRequest">
		<TextField label="What do you need?" name="title" required />
		<TextareaField label="Details" name="description" rows={3} />
		<Button variant="primary">Send request</Button>
	</form>
</section>

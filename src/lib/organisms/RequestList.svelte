<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'
	import Money from '#lib/atoms/Money.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import RequestForm from '#lib/organisms/RequestForm.svelte'

	/**
	 * All requests of a project. Drafts and client-asked requests can be edited, priced and sent.
	 * @type {{
	 *   requests: { id: string, title: string, description: string | null, price: number | null, estimated_hours: number | null, planned_start: string | null, status: string, requested_by: string | null, approved_at: string | null, declined_at: string | null }[],
	 *   timeZone: string
	 * }}
	 */
	const { requests, timeZone } = $props()
</script>

<section class="request-list">
	<Heading>Requests (extra work)</Heading>
	{#each requests as request (request.id)}
		{@const {
			id,
			title,
			description,
			price,
			estimated_hours,
			status,
			requested_by,
			approved_at,
			declined_at
		} = request}
		<article class="request-list-item">
			<p>
				<strong>{title}</strong>
				<StatusLabel {status} />{#if requested_by}
					· asked by client{/if}
			</p>
			{#if status === 'draft' || status === 'requested'}
				<RequestForm title="Edit" action="?/update" submitLabel="Save" {request} />
				<ActionButton action="?/send" label="Send to client" variant="primary" fields={{ id }} />
			{:else}
				{#if description}<p>{description}</p>{/if}
				<p>Price: <Money value={price} /> · Estimated hours: {estimated_hours ?? 'none'}</p>
				{#if status === 'approved'}<p>
						Approved <DateTime value={approved_at} {timeZone} />
					</p>{/if}
				{#if status === 'declined'}<p>Declined <DateTime value={declined_at} {timeZone} /></p>{/if}
			{/if}
			{#if status !== 'approved'}
				<ActionButton
					action="?/delete"
					label="Delete"
					variant="danger"
					fields={{ id }}
					confirm="Delete this request?"
				/>
			{/if}
		</article>
	{:else}
		<p>No requests yet.</p>
	{/each}
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * Project updates. With `editable`, updates can be hidden, shown and deleted.
	 * @type {{ updates: { id: string, title: string, body: string | null, created_at: string, visible_to_client?: boolean }[], timeZone?: string, editable?: boolean, title?: string }}
	 */
	const { updates, timeZone, editable = true, title = 'Updates' } = $props()
</script>

<section class="update-list">
	<Heading>{title}</Heading>
	{#each updates as { id, title: updateTitle, body, created_at, visible_to_client } (id)}
		<article class="update-list-item">
			<Heading level={3}>{updateTitle}</Heading>
			<p>
				<DateTime value={created_at} {timeZone} />
				{#if editable}· {visible_to_client ? 'visible to client' : 'private'}{/if}
			</p>
			{#if body}<p class="update-list-body">{body}</p>{/if}
			{#if editable}
				<ActionButton
					action="?/toggle"
					label={visible_to_client ? 'Hide from client' : 'Show to client'}
					fields={{ id, visible: !visible_to_client }}
				/>
				<ActionButton
					action="?/delete"
					label="Delete"
					variant="danger"
					fields={{ id }}
					confirm="Delete this update?"
				/>
			{/if}
		</article>
	{:else}
		<p>No updates yet.</p>
	{/each}
</section>

<style>
	.update-list-body {
		white-space: pre-wrap;
	}
</style>

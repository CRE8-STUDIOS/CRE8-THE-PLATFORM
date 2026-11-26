<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ files: { id: string, name: string, size?: string, shared?: boolean, url: string | null }[], editable?: boolean, title?: string }} */
	const { files, editable = true, title = 'Files' } = $props()
</script>

<section class="file-list card rough-edge">
	<Heading>{title}</Heading>
	<ul>
		{#each files as { id, name, size, shared, url } (id)}
			<li>
				<a href={url} target="_blank" rel="noopener">{name}</a>
				{#if size}({size}){/if}
				{#if editable}
					· {shared ? 'shared with client' : 'private'}
					<ActionButton
						action="?/share"
						label={shared ? 'Make private' : 'Share with client'}
						fields={{ id, shared: !shared }}
					/>
					<ActionButton
						action="?/delete"
						label="Delete"
						variant="danger"
						fields={{ id }}
						confirm="Delete {name}?"
					/>
				{/if}
			</li>
		{:else}
			<li>No files.</li>
		{/each}
	</ul>
</section>

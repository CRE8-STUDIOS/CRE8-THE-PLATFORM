<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ColorSwatch from '#lib/atoms/ColorSwatch.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ items: { id: string, type: string, content: string | null, imageUrl: string | null, x?: number, y?: number, width?: number | null, height?: number | null }[], editable?: boolean, title?: string }} */
	const { items, editable = false, title = 'Items' } = $props()
</script>

<section
	class="moodboard-items"
	class:card={editable}
	class:span-full={editable}
	class:rough-edge={editable}
>
	<Heading level={editable ? 2 : 3}>{title}</Heading>
	<ul class="moodboard-items-grid">
		{#each items as { id, type, content, imageUrl, x, y, width, height } (id)}
			<li class="moodboard-item moodboard-item-{type}">
				{#if type === 'image' && imageUrl}
					<img src={imageUrl} alt={content ?? 'Moodboard image'} width="200" />
				{:else if type === 'color'}
					<ColorSwatch color={content} size="large" />
					<span class="text-small">{content}</span>
				{:else if type === 'link' && content}
					<a href={content} target="_blank" rel="noopener">{content}</a>
				{:else}
					<p>{content}</p>
				{/if}
				{#if editable}
					<span class="text-small text-muted">
						x {x}, y {y}{#if width}, {width}×{height}{/if}
					</span>
					<ActionButton action="?/deleteItem" label="Remove" fields={{ id }} />
				{/if}
			</li>
		{:else}
			<li class="text-muted">Empty board.</li>
		{/each}
	</ul>
</section>

<style>
	.moodboard-items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--size-grid-tile), 1fr));
		gap: var(--space-s);
		padding: 0;
		list-style: none;
	}

	.moodboard-item {
		display: grid;
		align-content: start;
		gap: var(--space-xs);
		overflow-wrap: anywhere;
	}

	.moodboard-item img {
		inline-size: 100%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.moodboard-item-text,
	.moodboard-item-link {
		padding: var(--space-s);
		border-radius: var(--radius-small);
		background-color: var(--color-background);
	}
</style>

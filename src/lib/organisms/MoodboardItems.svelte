<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ColorSwatch from '#lib/atoms/ColorSwatch.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ items: { id: string, type: string, content: string | null, imageUrl: string | null, x?: number, y?: number, width?: number | null, height?: number | null }[], editable?: boolean, title?: string }} */
	const { items, editable = false, title = 'Items' } = $props()
</script>

<section class="moodboard-items">
	<Heading level={editable ? 2 : 3}>{title}</Heading>
	<ul>
		{#each items as { id, type, content, imageUrl, x, y, width, height } (id)}
			<li>
				{#if type === 'image' && imageUrl}
					<img src={imageUrl} alt={content ?? 'Moodboard image'} width="200" />
				{:else if type === 'color'}
					<ColorSwatch color={content} /> {content}
				{:else if type === 'link' && content}
					<a href={content} target="_blank" rel="noopener">{content}</a>
				{:else}
					{content}
				{/if}
				{#if editable}
					· x {x}, y {y}{#if width}, {width}×{height}{/if}
					<ActionButton action="?/deleteItem" label="Remove" fields={{ id }} />
				{/if}
			</li>
		{:else}
			<li>Empty board.</li>
		{/each}
	</ul>
</section>

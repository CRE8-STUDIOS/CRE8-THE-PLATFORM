<script>
	import { initialOf } from '#lib/workspace/tiles.js'

	/**
	 * An app in the workspace: an outlined square with its icon or first
	 * letter, and the name below. The icon is decorative, the name is shown.
	 * @type {{
	 *   name: string,
	 *   iconUrl?: string | null,
	 *   href?: string,
	 *   external?: boolean,
	 *   dashed?: boolean,
	 *   onclick?: (event: MouseEvent) => void
	 * }}
	 */
	const { name, iconUrl = null, href, external = true, dashed = false, onclick } = $props()
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	class="workspace-tile"
	{href}
	target={href && external ? '_blank' : undefined}
	rel={href && external ? 'noopener noreferrer' : undefined}
	{onclick}
	role={href ? undefined : 'group'}
	aria-label={href ? undefined : name}
>
	<span class={['workspace-tile-icon', { dashed }]}>
		{#if iconUrl}
			<img src={iconUrl} alt="" width="56" height="56" />
		{:else}
			<span aria-hidden="true">{initialOf(name) || '?'}</span>
		{/if}
	</span>
	<span class="workspace-tile-name">{name}</span>
</svelte:element>

<style>
	.workspace-tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		min-inline-size: 0;
		color: var(--color-text);
		text-decoration: none;
	}

	.workspace-tile-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		inline-size: 5.5rem;
		block-size: 5.5rem;
		overflow: hidden;
		border: var(--line);
		border-radius: 1.375rem;
		font-size: 1.875rem;
		font-weight: 800;
	}

	.workspace-tile-icon.dashed {
		border-style: dashed;
	}

	img {
		inline-size: 3.5rem;
		block-size: 3.5rem;
		object-fit: contain;
	}

	.workspace-tile-name {
		max-inline-size: 100%;
		overflow-wrap: anywhere;
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-align: center;
	}

	a.workspace-tile:hover .workspace-tile-name {
		text-decoration: underline;
	}
</style>

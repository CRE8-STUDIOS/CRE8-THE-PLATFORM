<script>
	/** @type {{ name: string, href?: string, iconUrl?: string | null, external?: boolean }} */
	const { name, href, iconUrl, external = false } = $props()
	const initial = $derived(name.replace(/[^\p{L}\p{N}]/gu, '').charAt(0))
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	class="app-tile card rough-edge"
	{href}
	target={href && external ? '_blank' : undefined}
	rel={href && external ? 'noopener' : undefined}
>
	{#if iconUrl}
		<img class="app-tile-icon" src={iconUrl} alt="" />
	{:else}
		<span class="app-tile-icon" aria-hidden="true">{initial}</span>
	{/if}
	<span class="app-tile-name">{name}</span>
</svelte:element>

<style>
	.app-tile {
		display: grid;
		justify-items: center;
		gap: var(--space-xs);
		block-size: 100%;
		text-align: center;
		text-decoration: none;
	}

	.app-tile > * + * {
		margin-block-start: 0;
	}

	.app-tile-icon {
		display: grid;
		place-content: center;
		inline-size: var(--size-icon);
		block-size: var(--size-icon);
		border-radius: var(--radius-card);
		background-color: var(--color-button-secondary);
		font-family: var(--font-family-display);
		font-size: var(--font-size-nav);
		object-fit: cover;
	}

	.app-tile-name {
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}
</style>

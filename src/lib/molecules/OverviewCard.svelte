<script>
	/**
	 * A card of the overview: an outlined section with a heading and an
	 * optional quiet line on the right.
	 * @type {{
	 *   id: string,
	 *   heading: string,
	 *   meta?: string,
	 *   hideHeading?: boolean,
	 *   class?: string,
	 *   lead?: import('svelte').Snippet,
	 *   children: import('svelte').Snippet
	 * } & Record<string, unknown>}
	 */
	const {
		id,
		heading,
		meta = '',
		hideHeading = false,
		class: extra,
		lead,
		children,
		...rest
	} = $props()
</script>

<section class={['overview-card', extra]} aria-labelledby={id} {...rest}>
	<div class="overview-card-heading" class:visually-hidden={hideHeading}>
		{#if lead}{@render lead()}{/if}
		<h2 {id}>{heading}</h2>
		{#if meta}<span>{meta}</span>{/if}
	</div>
	{@render children()}
</section>

<style>
	.overview-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		min-inline-size: 0;
		padding: var(--space-m) var(--space-l);
		border: var(--line);
		border-radius: 1.25rem;
	}

	.overview-card-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs) var(--space-s);
	}

	h2 {
		margin-inline-end: auto;
		font-size: var(--font-size-agenda-meta);
		font-weight: 800;
		text-transform: uppercase;
	}

	.overview-card-heading span {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}
</style>

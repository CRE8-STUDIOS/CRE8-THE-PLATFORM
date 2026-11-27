<script>
	/**
	 * A calm page section: an uppercase heading on a line, with an optional
	 * link or count on the right.
	 * @type {{
	 *   id: string,
	 *   heading: string,
	 *   aside?: import('svelte').Snippet,
	 *   class?: string,
	 *   children: import('svelte').Snippet
	 * } & Record<string, unknown>}
	 */
	const { id, heading, aside, class: extra, children, ...rest } = $props()
</script>

<section class={['calm-section', extra]} aria-labelledby={id} {...rest}>
	<div class="calm-section-heading">
		<h2 {id}>{heading}</h2>
		{#if aside}<div class="calm-section-aside">{@render aside()}</div>{/if}
	</div>
	{@render children()}
</section>

<style>
	.calm-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
		min-inline-size: 0;
	}

	.calm-section-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		min-block-size: var(--size-touch);
		justify-content: space-between;
		gap: var(--space-xs);
		border-block-end: var(--line);
	}

	h2 {
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}

	.calm-section-aside {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-s);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.calm-section-aside :global(a) {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

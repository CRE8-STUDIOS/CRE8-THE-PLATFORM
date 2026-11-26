<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ title?: string, label?: string, level?: 2 | 3, highlight?: boolean, wide?: boolean, actions?: import('svelte').Snippet, children: import('svelte').Snippet }} */
	const { title, label, level = 2, highlight = false, wide = false, actions, children } = $props()
</script>

<section
	class="card rough-edge"
	class:card-highlight={highlight}
	class:span-full={wide}
	aria-label={title ? undefined : label}
>
	{#if title || actions}
		<header class="card-header">
			<div>
				{#if label && title}<p class="label text-muted">{label}</p>{/if}
				{#if title}<Heading {level}>{title}</Heading>{/if}
			</div>
			{#if actions}<div class="button-group">{@render actions()}</div>{/if}
		</header>
	{/if}
	{@render children()}
</section>

<style>
	.card-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xs);
	}
</style>

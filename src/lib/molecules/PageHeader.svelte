<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ title: string, level?: 1 | 2, back?: { href: string, text: string }, intro?: string, label?: string, tag?: string, meta?: import('svelte').Snippet, actions?: import('svelte').Snippet }} */
	const { title, level = 1, back, intro, label, tag, meta, actions } = $props()
</script>

<header class="page-header">
	{#if back}<a class="back-link page-header-back" href={back.href}>Back to {back.text}</a>{/if}
	<div class="page-header-main">
		<div class="page-header-titles">
			{#if label}<p class="label text-muted">{label}</p>{/if}
			{#if meta}<p class="page-header-meta text-small text-muted">{@render meta()}</p>{/if}
			<Heading {level}>
				{title}{#if tag}<span class="version-tag page-header-tag">{tag}</span>{/if}
			</Heading>
			{#if intro}<p class="page-header-intro text-muted">{intro}</p>{/if}
		</div>
		{#if actions}<div class="button-group">{@render actions()}</div>{/if}
	</div>
</header>

<style>
	.page-header {
		display: grid;
		gap: var(--space-s);
	}

	.page-header-main {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.page-header-titles {
		display: grid;
		gap: var(--space-xs);
		min-inline-size: 0;
	}

	.page-header-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
	}

	.page-header-tag {
		margin-inline-start: var(--space-xs);
	}

	.page-header-intro {
		max-inline-size: var(--size-narrow);
	}
</style>

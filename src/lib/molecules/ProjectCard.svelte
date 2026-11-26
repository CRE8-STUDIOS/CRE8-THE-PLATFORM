<script>
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/** @type {{ href: string, title: string, status?: string, meta?: (string | null | undefined)[] }} */
	const { href, title, status, meta = [] } = $props()
	const details = $derived(meta.filter(Boolean))
</script>

<article class="project-card card rough-edge">
	<h3 class="project-card-title"><a {href}>{title}</a></h3>
	{#if status}<p><StatusLabel {status} /></p>{/if}
	{#if details.length}
		<p class="text-small text-muted">{details.join(' · ')}</p>
	{/if}
</article>

<style>
	.project-card {
		position: relative;
		block-size: 100%;
	}

	.project-card > * + * {
		margin-block-start: var(--space-xs);
	}

	.project-card-title {
		font-size: var(--font-size-card-title);
	}

	.project-card-title a {
		text-decoration: none;
	}

	.project-card-title a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.project-card:hover .project-card-title a {
		text-decoration-line: underline;
	}

	.project-card:focus-within {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}
</style>

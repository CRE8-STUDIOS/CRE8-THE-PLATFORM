<script>
	import ProgressLine from '#lib/molecules/ProgressLine.svelte'

	/**
	 * One track of the guide with its progress and what comes next.
	 * @type {{ href: string, title: string, line: string, done: number, total: number, next: string | null }}
	 */
	const { href, title, line, done, total, next } = $props()
</script>

<a class="track-card" {href}>
	<span class="track-card-title">{title}</span>
	<span class="track-card-line">{line}</span>
	<ProgressLine {done} {total} />
	<span class="track-card-next">
		{#if next}Next: {next} <span aria-hidden="true">›</span>{:else}All done{/if}
	</span>
</a>

<style>
	.track-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		min-inline-size: 0;
		padding: var(--space-l);
		border: var(--line);
		border-radius: 1.375rem;
		color: var(--color-text);
		text-decoration: none;
	}

	.track-card:hover .track-card-title {
		text-decoration: underline;
	}

	.track-card-title {
		font-size: 1.25rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.track-card :global(.progress-line) {
		margin-block-start: auto;
	}

	.track-card-line {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.55;
	}

	.track-card-next {
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
	}
</style>

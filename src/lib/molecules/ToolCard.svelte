<script>
	/**
	 * One tool in the workspace: name, what it is for and how much is in it.
	 * Without an href it is not available yet.
	 * @type {{ name: string, line: string, count: string, href?: string | null }}
	 */
	const { name, line, count, href = null } = $props()
</script>

{#if href}
	<a class="tool-card" {href}>
		<span class="tool-card-name">{name}</span>
		<span class="tool-card-line">{line}</span>
		<span class="tool-card-count">{count}</span>
	</a>
{:else}
	<div class="tool-card is-soon">
		<span class="tool-card-name">{name}</span>
		<span class="tool-card-line">{line}</span>
		<span class="tool-card-count">{count}</span>
	</div>
{/if}

<style>
	.tool-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-inline-size: 0;
		padding: var(--space-m) var(--space-l);
		border: var(--line);
		border-radius: var(--radius-item);
		color: var(--color-text);
		text-decoration: none;
	}

	.tool-card.is-soon {
		border: var(--line-dashed);
	}

	a.tool-card:hover .tool-card-name {
		text-decoration: underline;
	}

	.tool-card-name {
		font-size: var(--font-size-agenda-title);
		font-weight: 800;
		text-transform: uppercase;
	}

	.tool-card-line {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.tool-card-count {
		margin-block-start: var(--space-2xs);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
	}

	.is-soon .tool-card-count {
		color: var(--color-text-calm);
	}
</style>

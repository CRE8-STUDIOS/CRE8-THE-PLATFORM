<script>
	/**
	 * The important links: title, domain and an arrow, each opens in a new tab.
	 * @type {{ links: import('#lib/server/workspace.js').Link[], row?: import('svelte').Snippet<[import('#lib/server/workspace.js').Link]> }}
	 */
	const { links, row } = $props()
</script>

<ul class="workspace-links">
	{#each links as link (link.id)}
		<li>
			<a href={link.url} target="_blank" rel="noopener noreferrer">
				<span class="workspace-link-name">{link.name}</span>
				<span class="workspace-link-domain">{link.domain}</span>
				<span class="visually-hidden">(opens in a new tab)</span>
			</a>
			{#if row}{@render row(link)}{:else}<span class="workspace-link-arrow" aria-hidden="true">
					↗
				</span>{/if}
		</li>
	{/each}
</ul>

<style>
	.workspace-links {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
		min-block-size: var(--size-touch);
		padding-block: var(--space-xs);
		border-block-end: var(--line-quiet);
	}

	a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2xs) var(--space-s);
		min-inline-size: 0;
		color: var(--color-text);
		text-decoration: none;
	}

	a:hover .workspace-link-name {
		text-decoration: underline;
	}

	.workspace-link-name {
		font-size: var(--font-size-small);
		font-weight: 700;
	}

	.workspace-link-domain {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

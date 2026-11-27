<script>
	/**
	 * Tabs between the sections of one area, as plain links.
	 * @type {{ label: string, current: string, tabs: { href: string, text: string, match: RegExp }[] }}
	 */
	const { label, current, tabs } = $props()
</script>

<nav class="section-tabs" aria-label={label}>
	{#each tabs as { href, text, match } (href)}
		<a {href} aria-current={match.test(current) ? 'page' : undefined}>{text}</a>
	{/each}
</nav>

<style>
	.section-tabs {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--space-l);
	}

	a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text-calm);
		font-size: var(--font-size-small);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	a:hover {
		color: var(--color-text);
	}

	a[aria-current='page'] {
		color: var(--color-text);
		text-decoration: underline;
		text-decoration-thickness: var(--line-width-strong);
		text-underline-offset: 0.5em;
	}
</style>

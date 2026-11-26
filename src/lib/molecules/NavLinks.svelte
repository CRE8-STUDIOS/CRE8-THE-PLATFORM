<script>
	/** @type {{ label: string, links: { href: string, text: string, tag?: string }[], current: string, exact?: boolean, variant?: 'pills' | 'main' }} */
	const { label, links, current, exact = false, variant = 'pills' } = $props()

	const isCurrent = (/** @type {string} */ href) =>
		exact ? current === href : current === href || current.startsWith(`${href}/`)
</script>

<nav class="nav-links nav-links-{variant}" aria-label={label}>
	<ul class={variant === 'main' ? 'nav-list' : 'pill-list'}>
		{#each links as { href, text, tag } (href)}
			<li>
				<a
					class={variant === 'main' ? 'nav-link' : 'pill-link'}
					{href}
					aria-current={isCurrent(href) ? 'page' : undefined}
				>
					{text}
				</a>{#if tag}<span class="version-tag">{tag}</span>{/if}
			</li>
		{/each}
	</ul>
</nav>

<style>
	.nav-links-main li {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
</style>

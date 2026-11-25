<script>
	/** @type {{ label: string, links: { href: string, text: string }[], current: string, exact?: boolean }} */
	const { label, links, current, exact = false } = $props()

	const isCurrent = (/** @type {string} */ href) =>
		exact ? current === href : current === href || current.startsWith(`${href}/`)
</script>

<nav class="nav-links" aria-label={label}>
	<ul>
		{#each links as { href, text } (href)}
			<li><a {href} aria-current={isCurrent(href) ? 'page' : undefined}>{text}</a></li>
		{/each}
	</ul>
</nav>

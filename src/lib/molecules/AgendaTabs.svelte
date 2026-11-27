<script>
	/** @type {{ current: string }} */
	const { current } = $props()

	const TABS = [
		{ href: '/agenda', text: 'Agenda', match: /^\/agenda(\/(week|month|new|[0-9a-f-]{36}.*))?$/ },
		{ href: '/agenda/tasks', text: 'Tasks', match: /^\/agenda\/tasks/ },
		{ href: '/agenda/appointments', text: 'Appointments', match: /^\/agenda\/appointments/ },
		{ href: '/agenda/board', text: 'Project board', match: /^\/agenda\/board/ }
	]
</script>

<nav class="agenda-tabs" aria-label="Agenda sections">
	{#each TABS as { href, text, match } (href)}
		<a {href} aria-current={match.test(current) ? 'page' : undefined}>{text}</a>
	{/each}
</nav>

<style>
	.agenda-tabs {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--space-l);
	}

	.agenda-tabs a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text-calm);
		font-size: var(--font-size-small);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.agenda-tabs a[aria-current='page'] {
		color: var(--color-text);
		text-decoration: underline;
		text-decoration-thickness: var(--line-width-strong);
		text-underline-offset: 0.5em;
	}
</style>

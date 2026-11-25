<script>
	import NavLinks from '#lib/molecules/NavLinks.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ name: string, current: string }} */
	const { name, current } = $props()

	const links = $derived([
		{ href: '/portal', text: 'My projects' },
		{ href: '/portal/account', text: `My account (${name})` }
	])
</script>

<header class="portal-header">
	<a class="portal-header-logo" href="/portal">
		<span class="portal-header-title">Client portal</span>
		<span class="text-small text-muted">powered by CRE8</span>
	</a>
	<div class="portal-header-actions">
		<NavLinks label="Portal" {links} {current} exact />
		<ActionButton action="/logout" label="Log out" />
	</div>
</header>

<style>
	.portal-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
		padding-block: var(--space-s);
		padding-inline: var(--space-m);
		border-block-end: var(--border-width-thin) solid var(--color-border-divider);
	}

	.portal-header-logo {
		display: grid;
		text-decoration: none;
	}

	.portal-header-title {
		font-family: var(--font-family-display);
		font-size: var(--font-size-nav);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	.portal-header-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
	}

	@media (min-width: 48em) {
		.portal-header {
			padding-inline: var(--space-xl);
		}
	}
</style>

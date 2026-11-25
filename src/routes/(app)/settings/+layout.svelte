<script>
	import { page } from '$app/state'
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'

	const { data, children } = $props()
	const links = $derived([
		{ href: '/settings', text: 'Business & facturen' },
		{ href: '/settings/clock', text: 'Clock & meetings' },
		{ href: '/settings/hours', text: 'Working hours' },
		{ href: '/settings/theme', text: 'Theme' },
		{ href: '/settings/tiles', text: 'App buttons' },
		{ href: '/settings/templates', text: 'Contract templates' },
		...(data.profile?.is_admin ? [{ href: '/settings/tax', text: 'Tax rules (admin)' }] : [])
	])
</script>

<div class="settings-header">
	<PageHeader title="Settings" />
	<NavLinks label="Settings" {links} current={page.url.pathname} exact />
</div>

<div class="card-grid settings-content">
	{@render children()}
</div>

<style>
	.settings-header {
		display: grid;
		gap: var(--space-m);
	}

	.settings-content {
		--grid-min: var(--size-grid-2xl);
	}
</style>

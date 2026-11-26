<script>
	import { page } from '$app/state'
	import PortalHeader from '#lib/organisms/PortalHeader.svelte'

	const { data, children } = $props()
	const { account } = $derived(data)
</script>

<PortalHeader name={account?.display_name ?? account?.username ?? ''} current={page.url.pathname} />

<main id="content" class="portal-main">
	{@render children()}
</main>

<style>
	.portal-main {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--space-xl);
		inline-size: 100%;
		max-inline-size: var(--size-portal);
		margin-inline: auto;
		padding: var(--space-xl) var(--space-m);
	}
</style>

<script>
	import { page } from '$app/state'
	import PortalHeader from '#lib/organisms/PortalHeader.svelte'

	// Template for the client portal: header, then the page
	const { data, children } = $props()
	const { account } = $derived(data)
</script>

<PortalHeader name={account?.display_name ?? account?.username ?? ''} current={page.url.pathname} />

<main>
	{@render children()}
</main>

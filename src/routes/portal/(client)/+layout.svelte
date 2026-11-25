<script>
	import { page } from '$app/state'
	import PortalHeader from '#lib/organisms/PortalHeader.svelte'

	const { data, children } = $props()
	const { account } = $derived(data)
</script>

<PortalHeader name={account?.display_name ?? account?.username ?? ''} current={page.url.pathname} />

<main>
	{@render children()}
</main>

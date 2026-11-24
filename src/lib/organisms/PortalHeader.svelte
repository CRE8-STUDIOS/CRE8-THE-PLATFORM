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
	<a class="portal-header-logo" href="/portal">CRE8 · Client portal</a>
	<NavLinks label="Portal" {links} {current} exact />
	<ActionButton action="/logout" label="Log out" />
</header>

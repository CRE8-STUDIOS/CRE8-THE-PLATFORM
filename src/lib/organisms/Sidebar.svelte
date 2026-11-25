<script>
	import NavLinks from '#lib/molecules/NavLinks.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ current: string }} */
	const { current } = $props()

	const links = [
		{ href: '/overview', text: 'Overview' },
		{ href: '/projects', text: 'Projects' },
		{ href: '/clients', text: 'Clients' },
		{ href: '/agenda', text: 'Agenda' },
		{ href: '/time', text: 'Time' },
		{ href: '/finance', text: 'Finance' },
		{ href: '/moodboards', text: 'Moodboards' },
		{ href: '/notes', text: 'Notes' },
		{ href: '/settings', text: 'Settings' }
	]
</script>

<header class="app-header">
	<a class="app-header-logo" href="/overview">CRE8</a>
	<NavLinks label="Main" {links} {current} />
	<ActionButton action="/logout" label="Log out" />
</header>

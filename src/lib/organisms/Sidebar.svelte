<script>
	import NavLinks from '#lib/molecules/NavLinks.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import Mascot from '#lib/atoms/Mascot.svelte'

	/** @type {{ current: string, clock: import('svelte').Snippet }} */
	const { current, clock } = $props()

	const links = [
		{ href: '/overview', text: 'Overview' },
		{ href: '/workspace', text: 'Workspace' },
		{ href: '/agenda', text: 'Agenda' },
		{ href: '/projects', text: 'Projects' },
		{ href: '/tools', text: 'Tools' },
		{ href: '/finance', text: 'Finance' },
		{ href: '/guide', text: 'Guide' },
		{ href: '/assistant', text: 'Assistant', tag: 'V2' },
		{ href: '/settings', text: 'Settings' }
	]

	let enhanced = $state(false)
	let menuOpen = $state(false)

	$effect(() => {
		enhanced = true
	})

	$effect(() => {
		if (current) menuOpen = false
	})
</script>

<header class="sidebar" class:sidebar-collapsed={enhanced && !menuOpen}>
	<a class="sidebar-logo" href="/overview"><Mascot size="5.5rem" /></a>

	<div class="sidebar-clock">{@render clock()}</div>

	{#if enhanced}
		<button
			type="button"
			class="sidebar-menu-button button button-secondary button-small"
			aria-expanded={menuOpen}
			aria-controls="main-navigation"
			onclick={() => (menuOpen = !menuOpen)}
		>
			Menu
		</button>
	{/if}

	<div class="sidebar-navigation" id="main-navigation">
		<NavLinks label="Main" {links} {current} variant="main" />
	</div>

	<div class="sidebar-logout">
		<ActionButton action="/logout" label="Log out" />
	</div>
</header>

<style>
	.sidebar {
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-areas:
			'logo clock menu'
			'navigation navigation navigation'
			'logout logout logout';
		align-items: center;
		gap: var(--space-s);
		padding-block: var(--space-s);
		padding-inline: var(--space-m);
		border-block-end: var(--border-width-thin) solid var(--color-border-divider);
		background-color: var(--color-background);
	}

	.sidebar-logo {
		display: flex;
		grid-area: logo;
	}

	.sidebar-clock {
		grid-area: clock;
		justify-self: end;
	}

	.sidebar-menu-button {
		grid-area: menu;
	}

	.sidebar-navigation {
		grid-area: navigation;
		padding-block: var(--space-s);
		padding-inline-start: var(--space-s);
	}

	.sidebar-logout {
		grid-area: logout;
	}

	.sidebar-collapsed .sidebar-navigation,
	.sidebar-collapsed .sidebar-logout {
		display: none;
	}

	@media (min-width: 64em) {
		.sidebar {
			position: sticky;
			inset-block-start: 0;
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr auto auto;
			grid-template-areas:
				'logo'
				'navigation'
				'clock'
				'logout';
			align-items: start;
			block-size: 100dvh;
			padding: var(--space-xl);
			border-block-end: none;
			border-inline-end: var(--border-width-thin) solid var(--color-border-divider);
			overflow-y: auto;
		}

		.sidebar-logo {
			margin-block-start: calc(var(--space-m) * -1);
		}

		.sidebar-clock {
			justify-self: start;
		}

		.sidebar-menu-button {
			display: none;
		}

		.sidebar-collapsed .sidebar-navigation,
		.sidebar-collapsed .sidebar-logout {
			display: block;
		}

		.sidebar-navigation {
			padding-block: var(--space-l);
		}
	}
</style>

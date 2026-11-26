<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'

	/** @type {{ current: string, back?: { href: string, text: string }, actions?: import('svelte').Snippet }} */
	const { current, back, actions } = $props()

	const links = [
		{ href: '/finance/overview', text: 'Overview' },
		{ href: '/finance/tax', text: 'Tax' },
		{ href: '/finance', text: 'Facturen' },
		{ href: '/finance/expenses', text: 'Expenses' },
		{ href: '/finance/contacts', text: 'Contacts' }
	]
</script>

<div class="finance-header">
	<PageHeader title="Finance" {back} {actions} />
	<NavLinks label="Finance" {links} {current} exact />
</div>

<style>
	.finance-header {
		display: grid;
		gap: var(--space-m);
	}
</style>

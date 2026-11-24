<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import NavLinks from '#lib/molecules/NavLinks.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ExpenseForm from '#lib/organisms/ExpenseForm.svelte'
	import ExpenseList from '#lib/organisms/ExpenseList.svelte'

	const { data, form } = $props()
	const { expenses, projects } = $derived(data)

	const links = [
		{ href: '/finance', text: 'Facturen' },
		{ href: '/finance/expenses', text: 'Expenses' }
	]
</script>

<PageHeader title="Expenses" />
<NavLinks label="Finance" {links} current="/finance/expenses" exact />
<FormNotice {form} />
<ExpenseForm {projects} />
<ExpenseList {expenses} />

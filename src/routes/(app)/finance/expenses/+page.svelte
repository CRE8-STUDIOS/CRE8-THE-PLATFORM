<script>
	import FinanceHeader from '#lib/organisms/FinanceHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ExpenseForm from '#lib/organisms/ExpenseForm.svelte'
	import ExpenseList from '#lib/organisms/ExpenseList.svelte'

	const { data, form } = $props()
	const { expenses, projects } = $derived(data)
</script>

<FinanceHeader current="/finance/expenses" />

<div class="card-grid">
	<FormNotice {form} />
	<ExpenseList {expenses} />
	<ExpenseForm {projects} />
</div>

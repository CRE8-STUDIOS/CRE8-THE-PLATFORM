<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'

	/** @type {{ projects: { value: string, label: string }[] }} */
	const { projects } = $props()

	const vatRates = [
		{ value: '21', label: '21%' },
		{ value: '9', label: '9%' },
		{ value: '0', label: '0%' }
	]
</script>

<section class="expense-form">
	<Heading>Add expense</Heading>
	<form method="POST" action="?/add" enctype="multipart/form-data">
		<TextField label="Supplier" name="supplier" />
		<TextField label="Date" type="date" name="date" hint="Empty = today" />
		<TextField label="Amount excl. btw (€)" name="amount_excl_vat" inputmode="decimal" required />
		<SelectField label="Btw rate" name="vat_rate" options={vatRates} value="21" empty="No btw" />
		<TextField
			label="Btw amount (€)"
			name="vat_amount"
			inputmode="decimal"
			hint="Empty = calculated from the rate"
		/>
		<TextField label="Category" name="category" placeholder="e.g. equipment, travel, software" />
		<SelectField label="Project" name="project_id" options={projects} empty="None" />
		<TextField
			label="Receipt (image or PDF, max 10 MB)"
			type="file"
			name="receipt"
			accept="image/*,application/pdf"
		/>
		<TextField label="Note" name="note" />
		<Button variant="primary">Add expense</Button>
	</form>
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import { VAT_TREATMENTS, toOptions } from '#lib/utils/constants.js'

	/** @type {{ invoice: { client_id: string | null, issue_date: string | null, due_date: string | null, vat_treatment: string | null, notes: string | null }, clients: { value: string, label: string }[] }} */
	const { invoice, clients } = $props()
</script>

<section class="invoice-settings card rough-edge">
	<Heading>Factuur settings</Heading>
	<form method="POST" action="?/update">
		<SelectField label="Client" name="client_id" options={clients} value={invoice.client_id} />
		<TextField
			label="Issue date"
			type="date"
			name="issue_date"
			value={invoice.issue_date ?? ''}
			hint="Empty = the day you send it"
		/>
		<TextField
			label="Due date"
			type="date"
			name="due_date"
			value={invoice.due_date ?? ''}
			hint="Empty = issue date + your payment term"
		/>
		<SelectField
			label="Btw"
			name="vat_treatment"
			options={toOptions(VAT_TREATMENTS)}
			value={invoice.vat_treatment}
		/>
		<TextareaField label="Notes on the factuur" name="notes" rows={2} value={invoice.notes ?? ''} />
		<Button variant="primary">Save</Button>
	</form>
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'

	/** @type {{ status: string, options: { value: string, label: string }[] }} */
	const { status, options } = $props()
</script>

<section class="status-form card rough-edge">
	<Heading>Status</Heading>
	<form method="POST" action="?/status">
		<SelectField label="Status" name="status" {options} value={status} />
		<Button>Change status</Button>
	</form>
</section>

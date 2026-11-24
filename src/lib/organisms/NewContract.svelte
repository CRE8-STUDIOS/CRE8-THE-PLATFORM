<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'

	/** @type {{ templates: { value: string, label: string }[] }} */
	const { templates } = $props()
</script>

<section class="new-contract">
	<Heading>Contract</Heading>
	<p>This project has no contract yet.</p>
	<form method="POST" action="?/create">
		<TextField label="Title" name="title" value="Contract" />
		<SelectField label="Start from template" name="template_id" options={templates} empty="Blank" />
		<Button variant="primary">Create contract</Button>
	</form>
	<p><a href="/settings/templates">Manage contract templates</a></p>
</section>

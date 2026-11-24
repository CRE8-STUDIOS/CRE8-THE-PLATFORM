<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'

	/**
	 * @type {{ clients: { value: string, label: string }[], projects: { value: string, label: string }[], projectId: string | null, form: { message?: string } | null | undefined }}
	 */
	const { clients, projects, projectId, form } = $props()
</script>

<section class="new-invoice-form">
	<Heading>New factuur</Heading>
	<FormNotice {form} />
	<form method="POST" action="?/createInvoice">
		<SelectField
			label="Project"
			name="project_id"
			options={projects}
			value={projectId}
			empty="No project"
		/>
		<SelectField
			label="Client"
			name="client_id"
			options={clients}
			empty="Take the client from the project"
		/>
		<Button variant="primary">Create draft factuur</Button>
	</form>
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'

	/** @type {{ projects: { value: string, label: string }[], projectId: string | null, id?: string }} */
	const { projects, projectId, id } = $props()
</script>

<section {id} class="note-form card rough-edge">
	<Heading>New note</Heading>
	<form method="POST" action="?/create">
		<TextField label="Title" name="title" />
		<TextareaField label="Note" name="body" />
		<SelectField
			label="Project"
			name="project_id"
			options={projects}
			value={projectId}
			empty="None (loose note)"
		/>
		<Button variant="primary">Save note</Button>
	</form>
</section>

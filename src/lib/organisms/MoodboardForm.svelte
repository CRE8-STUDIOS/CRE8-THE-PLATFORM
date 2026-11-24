<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'

	/**
	 * Create or edit a moodboard.
	 * @type {{ title: string, action: string, submitLabel: string, projects: { value: string, label: string }[], projectId?: string | null, board?: { title: string, project_id: string | null, visible_to_client: boolean } }}
	 */
	const { title, action, submitLabel, projects, projectId, board } = $props()
</script>

<section class="moodboard-form">
	<Heading>{title}</Heading>
	<form method="POST" {action}>
		<TextField label="Title" name="title" value={board?.title ?? ''} required />
		<SelectField
			label="Project"
			name="project_id"
			options={projects}
			value={board?.project_id ?? projectId}
			empty="None (loose board)"
		/>
		<CheckboxField
			label="Visible to client in the portal"
			name="visible_to_client"
			checked={board?.visible_to_client ?? false}
		/>
		<Button variant="primary">{submitLabel}</Button>
	</form>
</section>

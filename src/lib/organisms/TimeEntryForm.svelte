<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import { TIME_CATEGORIES, toOptions } from '#lib/utils/constants.js'

	/** Add hours afterwards, when you forgot to clock in. */
	/** @type {{ projects: { value: string, label: string }[], projectId?: string }} */
	const { projects, projectId } = $props()
</script>

<section class="time-entry-form">
	<Heading>Add hours afterwards</Heading>
	<form method="POST" action="?/add">
		<SelectField
			label="Project"
			name="project_id"
			options={projects}
			value={projectId}
			empty="No project"
		/>
		<SelectField
			label="Category"
			name="category"
			options={toOptions(TIME_CATEGORIES)}
			value="client_work"
		/>
		<TextField label="Start" type="datetime-local" name="started_at" required />
		<TextField label="End" type="datetime-local" name="ended_at" required />
		<TextField label="Note" name="note" />
		<Button variant="primary">Add hours</Button>
	</form>
</section>

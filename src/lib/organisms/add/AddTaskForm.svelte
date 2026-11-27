<script>
	import AddForm from '#lib/organisms/AddForm.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'
	import DayChoice from '#lib/molecules/DayChoice.svelte'
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import DurationChoice from '#lib/molecules/DurationChoice.svelte'
	import ProjectField from '#lib/molecules/ProjectField.svelte'
	import MoreOptions from '#lib/molecules/MoreOptions.svelte'

	/** @type {import('./props.js').AddFormProps} */
	const { projects, heading = 'Add a task', submitLabel = 'Add task', ...shared } = $props()
</script>

<AddForm type="task" {heading} {submitLabel} moreHint="notes, checklist, reminder" {...shared}>
	{#snippet questions({ answers, errors })}
		<CalmField
			label="What needs to be done?"
			name="title"
			big
			value={answers.title ?? ''}
			placeholder="Send contract to Noor"
			error={errors.title}
		/>
		<DayChoice
			options={[
				{ value: 'today', label: 'Today' },
				{ value: 'tomorrow', label: 'Tomorrow' },
				{ value: 'pick', label: 'Pick a day' },
				{ value: 'none', label: 'No date' }
			]}
			value={answers.day ?? 'today'}
			date={answers.date ?? ''}
			hint={'No date means it waits in "without a date" and does not count in your day.'}
			error={errors.day}
		/>
		<PillGroup
			legend="How important"
			name="priority"
			options={[
				{ value: 'must', label: 'Must' },
				{ value: 'should', label: 'Should' },
				{ value: 'could', label: 'Could' },
				{ value: 'wont', label: "Won't" }
			]}
			value={answers.priority ?? 'must'}
			hint="Must = has to happen that day."
		/>
		<DurationChoice
			options={[
				{ value: '15', label: '15 min' },
				{ value: '30', label: '30 min' },
				{ value: '60', label: '1 hour' },
				{ value: '120', label: '2 hours' },
				{ value: 'other', label: 'Other' }
			]}
			value={answers.duration ?? '30'}
			minutes={answers.minutes ?? ''}
			error={errors.duration}
		/>
		<ProjectField {projects} value={answers.project_id} />
	{/snippet}
	{#snippet more({ answers })}
		<MoreOptions {answers} show={['notes', 'checklist', 'reminder']} />
	{/snippet}
</AddForm>

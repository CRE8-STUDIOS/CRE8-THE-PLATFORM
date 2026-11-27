<script>
	import AddForm from '#lib/organisms/AddForm.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'
	import DayChoice from '#lib/molecules/DayChoice.svelte'
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import ProjectField from '#lib/molecules/ProjectField.svelte'
	import MoreOptions from '#lib/molecules/MoreOptions.svelte'

	/** @type {import('./props.js').AddFormProps} */
	const { projects, heading = 'Add a deadline', submitLabel = 'Add deadline', ...shared } = $props()
</script>

<AddForm type="deadline" {heading} {submitLabel} moreHint="notes" {...shared}>
	{#snippet questions({ answers, errors })}
		<CalmField
			label="What has to be finished?"
			name="title"
			big
			value={answers.title ?? ''}
			placeholder="Lookbook delivery"
			error={errors.title}
		/>
		<DayChoice
			name="due"
			options={[
				{ value: 'this_friday', label: 'This Friday' },
				{ value: 'next_friday', label: 'Next Friday' },
				{ value: 'pick', label: 'Pick a date' }
			]}
			value={answers.due ?? 'this_friday'}
			date={answers.date ?? ''}
			dateError={errors.date}
		/>
		<PillGroup
			legend="Heads up"
			name="heads_up"
			options={[
				{ value: '1', label: '1 day before' },
				{ value: '3', label: '3 days before' },
				{ value: '7', label: '1 week before' }
			]}
			value={answers.heads_up ?? '3'}
		/>
		<ProjectField {projects} value={answers.project_id} />
	{/snippet}
	{#snippet more({ answers })}
		<MoreOptions {answers} show={['notes']} />
	{/snippet}
</AddForm>

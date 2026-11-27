<script>
	import AddForm from '#lib/organisms/AddForm.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'
	import DayChoice from '#lib/molecules/DayChoice.svelte'
	import TimeRange from '#lib/molecules/TimeRange.svelte'
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import ProjectField from '#lib/molecules/ProjectField.svelte'
	import MoreOptions from '#lib/molecules/MoreOptions.svelte'

	/** @type {import('./props.js').AddFormProps} */
	const {
		projects,
		heading = 'Add a work block',
		submitLabel = 'Add work block',
		...shared
	} = $props()
</script>

<AddForm type="work" {heading} {submitLabel} moreHint="checklist, repeat, notes" {...shared}>
	{#snippet questions({ answers, errors })}
		<CalmField
			label="What are you working on?"
			name="title"
			big
			value={answers.title ?? ''}
			placeholder="Moodboard summer campaign"
			error={errors.title}
		/>
		<DayChoice value={answers.day ?? 'today'} date={answers.date ?? ''} error={errors.day} />
		<TimeRange from={answers.from ?? '09:00'} to={answers.to ?? '11:30'} {errors} />
		<PillGroup
			legend="What kind of work"
			name="kind"
			options={[
				{ value: 'creative', label: 'Creative' },
				{ value: 'admin', label: 'Admin' },
				{ value: 'other', label: 'Other' }
			]}
			value={answers.kind ?? 'creative'}
		/>
		<div class="checks">
			<label class="check">
				<input type="checkbox" name="protect" checked={answers.protect === 'on'} />
				<span>Protect this block <small>Clients cannot book a meeting over it.</small></span>
			</label>
			<label class="check">
				<input type="checkbox" name="clock_in" checked={answers.clock_in === 'on'} />
				<span>Ask me to clock in when it starts</span>
			</label>
		</div>
		<ProjectField {projects} value={answers.project_id} />
	{/snippet}
	{#snippet more({ answers })}
		<MoreOptions {answers} show={['checklist', 'repeat', 'notes']} />
	{/snippet}
</AddForm>

<style>
	.checks {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.check {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		min-block-size: var(--size-touch);
		font-weight: 600;
	}

	.check small {
		display: block;
		color: var(--color-text-calm);
		font-size: var(--font-size-label);
		font-weight: 400;
	}
</style>

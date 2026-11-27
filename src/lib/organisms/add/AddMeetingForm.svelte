<script>
	import AddForm from '#lib/organisms/AddForm.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'
	import DayChoice from '#lib/molecules/DayChoice.svelte'
	import TimeRange from '#lib/molecules/TimeRange.svelte'
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import ProjectField from '#lib/molecules/ProjectField.svelte'
	import MoreOptions from '#lib/molecules/MoreOptions.svelte'

	/** @type {import('./props.js').AddFormProps} */
	const { projects, heading = 'Add a meeting', submitLabel = 'Add meeting', ...shared } = $props()
</script>

<AddForm
	type="meeting"
	{heading}
	{submitLabel}
	moreHint="people, checklist, reminder, repeat, notes"
	{...shared}
>
	{#snippet questions({ answers, errors })}
		<CalmField
			label="What is it about?"
			name="title"
			big
			value={answers.title ?? ''}
			placeholder="Campaign brief with Noor"
			error={errors.title}
		/>
		<DayChoice value={answers.day ?? 'today'} date={answers.date ?? ''} error={errors.day} />
		<TimeRange from={answers.from ?? '12:00'} to={answers.to ?? '13:00'} {errors} />
		<div class="where">
			<PillGroup
				legend="Where"
				name="where"
				options={[
					{ value: 'in_person', label: 'In person' },
					{ value: 'online', label: 'Online' },
					{ value: 'phone', label: 'Phone' }
				]}
				value={answers.where ?? 'in_person'}
			>
				<div class="where-address">
					<CalmField
						label="Address"
						name="address"
						value={answers.address ?? ''}
						placeholder="Studio Noor, NDSM 12"
					/>
				</div>
				<div class="where-link">
					<CalmField
						label="Meeting link"
						name="meeting_url"
						type="url"
						value={answers.meeting_url ?? ''}
						placeholder="https://"
						error={errors.meeting_url}
					/>
				</div>
			</PillGroup>
			<div class="where-travel">
				<PillGroup
					legend="Travel time"
					name="travel"
					options={[
						{ value: '0', label: 'None' },
						{ value: '15', label: '15 min' },
						{ value: '30', label: '30 min' },
						{ value: '45', label: '45 min' },
						{ value: '60', label: '1 hour' }
					]}
					value={answers.travel ?? '0'}
					hint="Blocked before and after, so nothing gets planned in it."
				/>
			</div>
		</div>
		<ProjectField {projects} value={answers.project_id} />
	{/snippet}
	{#snippet more({ answers })}
		<MoreOptions {answers} show={['people', 'checklist', 'reminder', 'repeat', 'notes']} />
	{/snippet}
</AddForm>

<style>
	.where {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
	}

	.where-link,
	.where:has(:global(input[value='online']:checked)) .where-address,
	.where:has(:global(input[value='phone']:checked)) .where-address,
	.where:has(:global(input[value='online']:checked)) .where-travel,
	.where:has(:global(input[value='phone']:checked)) .where-travel {
		display: none;
	}

	.where:has(:global(input[value='online']:checked)) .where-link {
		display: block;
	}
</style>

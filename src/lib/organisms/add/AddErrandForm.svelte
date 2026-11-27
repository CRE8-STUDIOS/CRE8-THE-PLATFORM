<script>
	import AddForm from '#lib/organisms/AddForm.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'
	import DayChoice from '#lib/molecules/DayChoice.svelte'
	import TimeRange from '#lib/molecules/TimeRange.svelte'
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import MoreOptions from '#lib/molecules/MoreOptions.svelte'

	/** @type {import('./props.js').AddFormProps} */
	const {
		projects: _projects,
		heading = 'Add an errand',
		submitLabel = 'Add errand',
		...shared
	} = $props()
</script>

<AddForm type="errand" {heading} {submitLabel} moreHint="reminder, notes" {...shared}>
	{#snippet questions({ answers, errors })}
		<CalmField
			label="What do you need to do?"
			name="title"
			big
			value={answers.title ?? ''}
			placeholder="Pick up prints"
			error={errors.title}
		/>
		<CalmField label="Place" name="location" value={answers.location ?? ''} placeholder="Fotolab" />
		<fieldset class="open">
			<legend>Open</legend>
			<TimeRange
				fromLabel="From"
				toLabel="Until"
				fromName="opens"
				toName="closes"
				from={answers.opens ?? '09:00'}
				to={answers.closes ?? '17:00'}
				{errors}
			/>
		</fieldset>
		<PillGroup
			legend="How long"
			name="duration"
			options={[
				{ value: '15', label: '15 min' },
				{ value: '30', label: '30 min' },
				{ value: '45', label: '45 min' },
				{ value: '60', label: '1 hour' }
			]}
			value={answers.duration ?? '30'}
		/>
		<div class="timing">
			<PillGroup
				legend="When"
				name="timing"
				options={[
					{ value: 'find', label: 'Find a time for me' },
					{ value: 'pick', label: 'Pick myself' }
				]}
				value={answers.timing ?? 'find'}
				hint="CRE8 looks for a free moment while the place is open."
			/>
			<div class="timing-pick">
				<DayChoice
					legend="Day"
					value={answers.day ?? 'today'}
					date={answers.date ?? ''}
					error={errors.day}
				/>
				<CalmField
					label="At"
					name="from"
					type="time"
					value={answers.from ?? ''}
					error={errors.from}
				/>
			</div>
		</div>
	{/snippet}
	{#snippet more({ answers })}
		<MoreOptions {answers} show={['reminder', 'notes']} />
	{/snippet}
</AddForm>

<style>
	.open {
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		margin-block-end: var(--space-xs);
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	.timing {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
	}

	.timing-pick {
		display: none;
		flex-direction: column;
		gap: var(--space-m);
		max-inline-size: 22rem;
	}

	.timing:has(:global(input[value='pick']:checked)) .timing-pick {
		display: flex;
	}
</style>

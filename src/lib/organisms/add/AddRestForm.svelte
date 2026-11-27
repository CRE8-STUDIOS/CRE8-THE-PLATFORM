<script>
	import AddForm from '#lib/organisms/AddForm.svelte'
	import DayChoice from '#lib/molecules/DayChoice.svelte'
	import TimeRange from '#lib/molecules/TimeRange.svelte'
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import MoreOptions from '#lib/molecules/MoreOptions.svelte'

	/** @type {import('./props.js').AddFormProps} */
	const {
		projects: _projects,
		heading = 'Add rest',
		submitLabel = 'Add rest',
		...shared
	} = $props()
</script>

<AddForm type="rest" {heading} {submitLabel} moreHint="repeat, notes" {...shared}>
	{#snippet questions({ answers, errors })}
		<div class="rest">
			<PillGroup
				legend="What kind of rest"
				name="kind"
				options={[
					{ value: 'lunch', label: 'Lunch' },
					{ value: 'break', label: 'Break' },
					{ value: 'day_off', label: 'Day off' },
					{ value: 'holiday', label: 'Holiday' }
				]}
				value={answers.kind ?? 'lunch'}
			/>
			<DayChoice value={answers.day ?? 'today'} date={answers.date ?? ''} error={errors.day} />
			<div class="rest-times">
				<TimeRange from={answers.from ?? '13:15'} to={answers.to ?? '14:00'} {errors} />
			</div>
		</div>
		<label class="check">
			<input type="checkbox" name="lock" checked={answers.lock === 'on'} />
			<span>
				Lock it <small>Nothing can be planned over it, not by you and not by clients.</small>
			</span>
		</label>
	{/snippet}
	{#snippet more({ answers })}
		<MoreOptions {answers} show={['repeat', 'notes']} />
	{/snippet}
</AddForm>

<style>
	.rest {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
	}

	.rest:has(:global(input[value='day_off']:checked)) .rest-times,
	.rest:has(:global(input[value='holiday']:checked)) .rest-times {
		display: none;
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

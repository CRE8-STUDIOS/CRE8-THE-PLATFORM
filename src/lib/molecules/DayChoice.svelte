<script>
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'

	/**
	 * Today, tomorrow or a picked day (and optionally no date). The date input
	 * shows when PICK is chosen, also without JavaScript.
	 * @type {{
	 *   legend?: string,
	 *   name?: string,
	 *   options?: { value: string, label: string }[],
	 *   value?: string,
	 *   date?: string,
	 *   hint?: string,
	 *   error?: string,
	 *   dateError?: string
	 * }}
	 */
	const {
		legend = 'When',
		name = 'day',
		options = [
			{ value: 'today', label: 'Today' },
			{ value: 'tomorrow', label: 'Tomorrow' },
			{ value: 'pick', label: 'Pick a day' }
		],
		value = 'today',
		date = '',
		hint,
		error,
		dateError
	} = $props()
</script>

<div class="day-choice">
	<PillGroup {legend} {name} {options} {value} {hint} {error}>
		<div class="day-choice-date">
			<CalmField label="Date" name="date" type="date" value={date} error={dateError} />
		</div>
	</PillGroup>
</div>

<style>
	.day-choice-date {
		display: none;
		max-inline-size: 14rem;
	}

	.day-choice:has(:global(input[value='pick']:checked)) .day-choice-date {
		display: block;
	}
</style>

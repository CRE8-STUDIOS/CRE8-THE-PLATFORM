<script>
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'

	/**
	 * How long, as pills. OTHER shows a number input in minutes.
	 * @type {{ legend?: string, options: { value: string, label: string }[], value?: string, minutes?: string, error?: string }}
	 */
	const { legend = 'How long', options, value, minutes = '', error } = $props()
</script>

<div class="duration-choice">
	<PillGroup {legend} name="duration" {options} {value} {error}>
		{#if options.some((option) => option.value === 'other')}
			<div class="duration-choice-other">
				<CalmField
					label="Minutes"
					name="minutes"
					type="number"
					min="1"
					max="1440"
					value={minutes}
				/>
			</div>
		{/if}
	</PillGroup>
</div>

<style>
	.duration-choice-other {
		display: none;
		max-inline-size: 10rem;
	}

	.duration-choice:has(:global(input[value='other']:checked)) .duration-choice-other {
		display: block;
	}
</style>

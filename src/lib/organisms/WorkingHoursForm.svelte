<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'
	import { WEEKDAYS } from '#lib/utils/constants.js'

	/** @type {{ kinds: { value: string, label: string }[] }} */
	const { kinds } = $props()
</script>

<section class="working-hours-form card rough-edge">
	<Heading>Add hours</Heading>
	<form method="POST" action="?/add">
		<SelectField label="Kind" name="kind" options={kinds} value="work" />
		<fieldset>
			<legend>Days</legend>
			{#each WEEKDAYS as day, index (day)}
				<CheckboxField label={day} name="weekday" value={index + 1} />
			{/each}
		</fieldset>
		<TextField label="From" type="time" name="starts_at" required />
		<TextField label="To" type="time" name="ends_at" required />
		<Button variant="primary">Add</Button>
	</form>
</section>

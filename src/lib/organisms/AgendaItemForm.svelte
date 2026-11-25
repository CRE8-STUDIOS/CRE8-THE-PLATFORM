<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'
	import { toLocalInput } from '#lib/utils/dates.js'
	import { AGENDA_TYPES, ENERGY_TYPES, toOptions } from '#lib/utils/constants.js'

	/**
	 * @type {{
	 *   title: string, action: string, submitLabel: string, timeZone: string,
	 *   projects: { value: string, label: string }[],
	 *   item?: import('#lib/database.types.js').Tables<'agenda_items'>
	 * }}
	 */
	const { title, action, submitLabel, timeZone, projects, item } = $props()
</script>

<section class="agenda-item-form">
	<Heading>{title}</Heading>
	<form method="POST" {action}>
		<SelectField
			label="Type"
			name="type"
			options={toOptions(AGENDA_TYPES)}
			value={item?.type ?? 'task'}
		/>
		<TextField label="Title" name="title" value={item?.title ?? ''} required />
		<SelectField
			label="Project"
			name="project_id"
			options={projects}
			value={item?.project_id}
			empty="None"
		/>
		<TextField
			label="Starts"
			type="datetime-local"
			name="starts_at"
			value={toLocalInput(item?.starts_at, timeZone)}
			hint="No start time = it goes to the inbox"
		/>
		<TextField
			label="Ends"
			type="datetime-local"
			name="ends_at"
			value={toLocalInput(item?.ends_at, timeZone)}
		/>
		<CheckboxField label="All day" name="all_day" checked={item?.all_day ?? false} />
		<TextField
			label="Due date (for inbox tasks)"
			type="date"
			name="due_date"
			value={item?.due_date ?? ''}
		/>
		<TextField
			label="Estimated minutes"
			name="estimated_minutes"
			inputmode="numeric"
			value={item?.estimated_minutes ?? ''}
		/>
		<TextField label="Location" name="location_name" value={item?.location_name ?? ''} />
		<CheckboxField
			label="Lock this rest block"
			name="is_protected"
			checked={item?.is_protected ?? false}
		/>

		{#if item}
			<SelectField
				label="Energy"
				name="energy"
				options={toOptions(ENERGY_TYPES)}
				value={item.energy}
				empty="Not set"
			/>
			<fieldset>
				<legend>Where</legend>
				<TextField label="Address" name="address" value={item.address ?? ''} />
				<TextField
					label="Meeting link"
					name="meeting_url"
					type="url"
					value={item.meeting_url ?? ''}
				/>
				<TextField
					label="Opens at (errands)"
					name="opens_at"
					type="time"
					value={item.opens_at?.slice(0, 5) ?? ''}
				/>
				<TextField
					label="Closes at (errands)"
					name="closes_at"
					type="time"
					value={item.closes_at?.slice(0, 5) ?? ''}
				/>
			</fieldset>
			<fieldset>
				<legend>Shoot / gig day</legend>
				<TextField
					label="Call time"
					type="datetime-local"
					name="call_time"
					value={toLocalInput(item.call_time, timeZone)}
				/>
				<TextField
					label="Travel before (minutes)"
					name="travel_before_minutes"
					inputmode="numeric"
					value={item.travel_before_minutes}
				/>
				<TextField
					label="Travel after (minutes)"
					name="travel_after_minutes"
					inputmode="numeric"
					value={item.travel_after_minutes}
				/>
			</fieldset>
			<fieldset>
				<legend>Repeat and remind</legend>
				<TextField
					label="Repeat rule"
					name="recurrence_rule"
					value={item.recurrence_rule ?? ''}
					hint="e.g. FREQ=WEEKLY;BYDAY=MO"
				/>
				<TextField
					label="Repeat until"
					type="date"
					name="recurrence_until"
					value={item.recurrence_until ?? ''}
				/>
				<TextField
					label="Reminders, minutes before"
					name="reminder_minutes"
					value={item.reminder_minutes.join(', ')}
					hint="e.g. 15, 60"
				/>
			</fieldset>
			<TextField label="Colour" type="color" name="color" value={item.color ?? '#888888'} />
		{:else}
			<CheckboxField
				label="Open details after adding (checklist, people, travel time...)"
				name="open_after"
			/>
		{/if}

		<TextareaField label="Notes" name="description" rows={2} value={item?.description ?? ''} />
		<Button variant="primary">{submitLabel}</Button>
	</form>
</section>

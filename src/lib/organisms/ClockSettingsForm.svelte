<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'

	/** @type {{ settings: { clock_in_mode: string, check_in_after_minutes: number, timezone: string, meeting_minutes: number, booking_notice_hours: number, booking_days_ahead: number } }} */
	const { settings } = $props()

	const modes = [
		{ value: 'ask', label: 'Ask "Clock in for this project?"' },
		{ value: 'auto', label: 'Clock in automatically' },
		{ value: 'off', label: 'Do nothing (manual only)' }
	]
</script>

<section class="clock-settings-form card rough-edge">
	<Heading>Clock & meetings</Heading>
	<form method="POST" action="?/save">
		<fieldset>
			<legend>Clock-in</legend>
			<SelectField
				label="When I open a project"
				name="clock_in_mode"
				options={modes}
				value={settings.clock_in_mode}
			/>
			<TextField
				label={`Ask "Still working?" after (minutes without activity in CRE8)`}
				name="check_in_after_minutes"
				inputmode="numeric"
				value={settings.check_in_after_minutes}
				hint="No answer within 10 minutes stops the clock at the moment of the question. Closing your laptop or browser stops it at your last activity."
			/>
		</fieldset>
		<fieldset>
			<legend>Client meetings</legend>
			<TextField
				label="Meeting length (minutes)"
				name="meeting_minutes"
				inputmode="numeric"
				value={settings.meeting_minutes}
			/>
			<TextField
				label="Minimum notice (hours)"
				name="booking_notice_hours"
				inputmode="numeric"
				value={settings.booking_notice_hours}
			/>
			<TextField
				label="Bookable up to (days ahead)"
				name="booking_days_ahead"
				inputmode="numeric"
				value={settings.booking_days_ahead}
			/>
			<p>Clients can only pick times inside your <a href="/settings/hours">meeting hours</a>.</p>
		</fieldset>
		<TextField
			label="Time zone"
			name="timezone"
			value={settings.timezone}
			hint="e.g. Europe/Amsterdam"
		/>
		<Button variant="primary">Save</Button>
	</form>
</section>

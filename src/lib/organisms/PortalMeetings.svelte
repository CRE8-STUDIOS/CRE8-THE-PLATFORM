<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import { formatDateTime, formatTime } from '#lib/utils/dates.js'

	/**
	 * Meetings in the portal: your meetings, and request a new one in a free time.
	 * Times are shown in the client's own time zone, so they're formatted here in the browser.
	 * @type {{ meetings: { id: string, starts_at: string, ends_at: string, status: string }[], slots: { starts_at: string, ends_at: string }[] }}
	 */
	const { meetings, slots } = $props()

	const slotOptions = $derived(
		slots.map(({ starts_at, ends_at }) => ({
			value: starts_at,
			label: `${formatDateTime(starts_at)} to ${formatTime(ends_at)}`
		}))
	)
</script>

<section class="portal-meetings">
	<Heading>Meetings</Heading>
	<ul>
		{#each meetings as { id, starts_at, ends_at, status } (id)}
			<li>
				<DateTime value={starts_at} /> to <DateTime value={ends_at} show="time" />
				· {status === 'pending' ? 'waiting for confirmation' : 'confirmed'}
				<ActionButton
					action="?/cancelMeeting"
					label="Cancel"
					fields={{ id }}
					confirm="Cancel this meeting?"
				/>
			</li>
		{:else}
			<li>No meetings planned.</li>
		{/each}
	</ul>

	<Heading level={3}>Request a meeting</Heading>
	{#if slotOptions.length}
		<form method="POST" action="?/requestMeeting">
			<SelectField label="Pick a time" name="starts_at" options={slotOptions} required />
			<TextField label="Message (optional)" name="message" />
			<Button variant="primary">Request meeting</Button>
		</form>
	{:else}
		<p>No open times in the next two weeks.</p>
	{/if}
</section>

<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import MeetingRequests from '#lib/organisms/MeetingRequests.svelte'
	import AgendaWeek from '#lib/organisms/AgendaWeek.svelte'
	import AgendaInbox from '#lib/organisms/AgendaInbox.svelte'
	import AgendaItemForm from '#lib/organisms/AgendaItemForm.svelte'

	const { data, form } = $props()
	const { monday, previousWeek, nextWeek, week, inbox, meetings, projects, timezone } =
		$derived(data)
</script>

<PageHeader title="Agenda">
	{#snippet actions()}
		<a class="button button-primary" href="#add-to-agenda">+ Add to agenda</a>
	{/snippet}
</PageHeader>

<div class="card-grid">
	<FormNotice {form} />
	<MeetingRequests {meetings} timeZone={timezone} />
	<AgendaWeek {monday} {previousWeek} {nextWeek} {week} timeZone={timezone} />
	<AgendaInbox items={inbox} />
	<AgendaItemForm
		id="add-to-agenda"
		title="Add to agenda"
		action="?/create"
		submitLabel="Add"
		{projects}
		timeZone={timezone}
	/>
</div>

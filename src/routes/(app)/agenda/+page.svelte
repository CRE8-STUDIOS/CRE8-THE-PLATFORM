<script>
	import AgendaHeading from '#lib/molecules/AgendaHeading.svelte'
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import Timeline from '#lib/organisms/Timeline.svelte'

	const { data } = $props()
</script>

<AgendaHeading
	title={data.title}
	meta={data.meta}
	view="day"
	views={{
		day: `/agenda?date=${data.date}`,
		week: `/agenda/week?date=${data.date}`,
		month: `/agenda/month?month=${data.date.slice(0, 7)}`
	}}
	previous={{ href: `/agenda?date=${data.previous}`, label: 'Previous day' }}
	next={{ href: `/agenda?date=${data.next}`, label: 'Next day' }}
/>
<MascotBar />
<Timeline rows={data.rows} allDay={data.allDay} timeZone={data.timezone} label={data.title} />

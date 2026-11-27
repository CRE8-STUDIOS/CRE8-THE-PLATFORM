<script>
	import AgendaHeading from '#lib/molecules/AgendaHeading.svelte'
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import WeekGrid from '#lib/organisms/WeekGrid.svelte'

	const { data } = $props()
</script>

<AgendaHeading
	title={data.title}
	meta={data.meta}
	view="week"
	views={{
		day: `/agenda?date=${data.date}`,
		week: `/agenda/week?date=${data.date}`,
		month: `/agenda/month?month=${data.date.slice(0, 7)}`
	}}
	previous={{ href: `/agenda/week?date=${data.previous}`, label: 'Previous week' }}
	next={{ href: `/agenda/week?date=${data.next}`, label: 'Next week' }}
/>
<MascotBar />
<WeekGrid
	layout={data.layout}
	today={data.today}
	timeZone={data.timezone}
	label="Week of {data.title}"
/>

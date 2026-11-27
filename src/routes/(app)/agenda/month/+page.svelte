<script>
	import AgendaHeading from '#lib/molecules/AgendaHeading.svelte'
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import MonthGrid from '#lib/organisms/MonthGrid.svelte'

	const { data } = $props()
</script>

<AgendaHeading
	title={data.title}
	meta={data.meta}
	view="month"
	views={{
		day: `/agenda?date=${data.day}`,
		week: `/agenda/week?date=${data.day}`,
		month: `/agenda/month?month=${data.month}`
	}}
	previous={{ href: `/agenda/month?month=${data.previous}`, label: 'Previous month' }}
	next={{ href: `/agenda/month?month=${data.next}`, label: 'Next month' }}
/>
<MascotBar />
<MonthGrid cells={data.cells} label={data.title} />

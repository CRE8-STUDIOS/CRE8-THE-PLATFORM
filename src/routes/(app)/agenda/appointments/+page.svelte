<script>
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import AppointmentList from '#lib/organisms/AppointmentList.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Appointments · CRE8</title></svelte:head>

<h1>Appointments</h1>
<MascotBar />

<div class="appointment-lists">
	<AppointmentList heading="Meetings" rows={data.meetings} empty="No meetings planned." />
	<AppointmentList heading="Errands" rows={data.errands} empty="No errands." />
	<AppointmentList heading="Deadlines" rows={data.deadlines} empty="No deadlines coming up." />
</div>

<style>
	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.appointment-lists {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
		gap: var(--space-xl);
		max-inline-size: var(--agenda-max-width);
	}
</style>

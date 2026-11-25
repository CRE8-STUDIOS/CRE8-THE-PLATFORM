<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import HoursSummary from '#lib/organisms/HoursSummary.svelte'
	import TimeEntryList from '#lib/organisms/TimeEntryList.svelte'
	import TimeEntryForm from '#lib/organisms/TimeEntryForm.svelte'

	const { data, form } = $props()
	const {
		project,
		year,
		totalHours,
		hoursCriterion,
		criterionPercentage,
		monday,
		previousWeek,
		nextWeek,
		entries,
		weekHours,
		projects,
		timezone
	} = $derived(data)
</script>

<PageHeader
	title={project ? `Time · ${project.title}` : 'Time'}
	back={project ? { href: `/projects/${project.id}`, text: 'the project' } : undefined}
/>
<div class="card-grid">
	<FormNotice {form} />
	<HoursSummary {project} {year} {totalHours} {hoursCriterion} {criterionPercentage} />
	<TimeEntryList
		{entries}
		{monday}
		{previousWeek}
		{nextWeek}
		{weekHours}
		projectId={project?.id}
		timeZone={timezone}
	/>
	<TimeEntryForm {projects} projectId={project?.id} />
</div>

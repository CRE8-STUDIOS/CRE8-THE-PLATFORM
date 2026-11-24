<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * Clocked hours of one week.
	 * @type {{
	 *   entries: { id: string, started_at: string, ended_at: string | null, hours: number, category: string, note: string | null, stopped_by: string | null, projects: { title: string } | null }[],
	 *   monday: string, previousWeek: string, nextWeek: string, weekHours: number, projectId?: string, timeZone: string
	 * }}
	 */
	const { entries, monday, previousWeek, nextWeek, weekHours, projectId, timeZone } = $props()
	const projectQuery = $derived(projectId ? `&project=${projectId}` : '')
</script>

<section class="time-entry-list">
	<Heading>Week of {monday}: {weekHours} h</Heading>
	<nav aria-label="Weeks">
		<a href="?week={previousWeek}{projectQuery}">Previous week</a> ·
		<a href="?week={nextWeek}{projectQuery}">Next week</a>
	</nav>
	<ul>
		{#each entries as { id, started_at, ended_at, hours, category, note, stopped_by, projects } (id)}
			<li>
				<DateTime value={started_at} {timeZone} /> to
				{#if ended_at}<DateTime value={ended_at} {timeZone} show="time" />{:else}running{/if}
				· {hours} h · {category.replaceAll('_', ' ')}
				{#if projects}· {projects.title}{/if}
				{#if stopped_by && stopped_by !== 'manual'}· stopped: {stopped_by.replaceAll('_', ' ')}{/if}
				{#if note}· {note}{/if}
				{#if ended_at}
					<ActionButton
						action="?/delete"
						label="Delete"
						variant="danger"
						fields={{ id }}
						confirm="Delete these hours?"
					/>
				{/if}
			</li>
		{:else}
			<li>No hours this week.</li>
		{/each}
	</ul>
</section>

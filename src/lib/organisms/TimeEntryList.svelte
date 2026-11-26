<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * @type {{
	 *   entries: { id: string, started_at: string, ended_at: string | null, hours: number, category: string, note: string | null, stopped_by: string | null, projects: { title: string } | null }[],
	 *   monday: string, previousWeek: string, nextWeek: string, weekHours: number, projectId?: string, timeZone: string
	 * }}
	 */
	const { entries, monday, previousWeek, nextWeek, weekHours, projectId, timeZone } = $props()
	const projectQuery = $derived(projectId ? `&project=${projectId}` : '')
</script>

<section class="time-entry-list card rough-edge">
	<Heading>Week of {monday}: {weekHours} h</Heading>
	<nav aria-label="Weeks">
		<ul class="pill-list">
			<li><a class="pill-link" href="?week={previousWeek}{projectQuery}">Previous week</a></li>
			<li><a class="pill-link" href="?week={nextWeek}{projectQuery}">Next week</a></li>
		</ul>
	</nav>
	<ul>
		{#each entries as { id, started_at, ended_at, hours, category, note, stopped_by, projects } (id)}
			<li>
				<span class="time-entry-text">
					<span>
						<DateTime value={started_at} {timeZone} /> to
						{#if ended_at}<DateTime value={ended_at} {timeZone} show="time" />{:else}running{/if}
					</span>
					<span class="text-small text-muted">
						{category.replaceAll('_', ' ')}{#if projects}
							· {projects.title}{/if}{#if stopped_by && stopped_by !== 'manual'}
							· stopped: {stopped_by.replaceAll('_', ' ')}{/if}{#if note}
							· {note}{/if}
					</span>
				</span>
				<span class="list-end card-title">{hours} h</span>
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
			<li class="text-muted">No hours this week.</li>
		{/each}
	</ul>
</section>

<style>
	.time-entry-text {
		display: grid;
		flex: 1 1 var(--size-grid-s);
	}
</style>

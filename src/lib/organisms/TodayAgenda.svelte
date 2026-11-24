<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'

	/**
	 * @type {{
	 *   items: { id: string, type: string, title: string, starts_at: string | null, all_day: boolean, status: string, projects: { title: string } | null }[],
	 *   dueTasks: { id: string, type: string, title: string, due_date: string | null, projects: { title: string } | null }[],
	 *   timeZone: string
	 * }}
	 */
	const { items, dueTasks, timeZone } = $props()
</script>

<section class="today-agenda">
	<Heading>Today</Heading>
	<ul>
		{#each items as { id, type, title, starts_at, all_day, status, projects } (id)}
			<li>
				{#if all_day}All day{:else}<DateTime value={starts_at} {timeZone} show="time" />{/if}
				· {type} · <a href="/agenda/{id}">{title}</a>
				{#if projects}· {projects.title}{/if}
				{#if status === 'done'}(done){/if}
			</li>
		{:else}
			<li>Nothing planned today.</li>
		{/each}
	</ul>

	{#if dueTasks.length}
		<Heading level={3}>Tasks due</Heading>
		<ul>
			{#each dueTasks as { id, type, title, due_date, projects } (id)}
				<li>
					{type} · <a href="/agenda/{id}">{title}</a> (due {due_date}){#if projects}
						· {projects.title}{/if}
				</li>
			{/each}
		</ul>
	{/if}
</section>

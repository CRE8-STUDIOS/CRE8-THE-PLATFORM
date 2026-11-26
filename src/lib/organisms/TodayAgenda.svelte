<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/**
	 * @type {{
	 *   items: { id: string, type: string, title: string, starts_at: string | null, all_day: boolean, status: string, projects: { title: string } | null }[],
	 *   dueTasks: { id: string, type: string, title: string, due_date: string | null, projects: { title: string } | null }[],
	 *   timeZone: string
	 * }}
	 */
	const { items, dueTasks, timeZone } = $props()
</script>

<section class="today-agenda card rough-edge">
	<Heading>Today</Heading>
	<ul>
		{#each items as { id, type, title, starts_at, all_day, status, projects } (id)}
			<li>
				<span class="today-agenda-time">
					{#if all_day}All day{:else}<DateTime value={starts_at} {timeZone} show="time" />{/if}
				</span>
				<span class="today-agenda-text">
					<a href="/agenda/{id}">{title}</a>
					<span class="text-small text-muted">
						{type}{#if projects}
							· {projects.title}{/if}
					</span>
				</span>
				{#if status === 'done'}<span class="list-end"><StatusLabel status="done" /></span>{/if}
			</li>
		{:else}
			<li class="text-muted">Nothing planned today.</li>
		{/each}
	</ul>

	{#if dueTasks.length}
		<Heading level={3}>Tasks due</Heading>
		<ul>
			{#each dueTasks as { id, type, title, due_date, projects } (id)}
				<li>
					<span class="today-agenda-text">
						<a href="/agenda/{id}">{title}</a>
						<span class="text-small text-muted">
							{type}{#if projects}
								· {projects.title}{/if}
						</span>
					</span>
					<span class="list-end text-small text-muted">due {due_date}</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.today-agenda-time {
		min-inline-size: 3.5em;
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-display);
	}

	.today-agenda-text {
		display: grid;
		flex: 1 1 0;
		min-inline-size: 0;
	}
</style>

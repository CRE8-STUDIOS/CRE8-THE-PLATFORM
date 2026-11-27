<script>
	import OverviewCard from '#lib/molecules/OverviewCard.svelte'
	import TaskRow from '#lib/molecules/TaskRow.svelte'

	/**
	 * The tasks dated today, must first, done ones at the end.
	 * @type {{ tasks: import('#lib/agenda/lists.js').Task[], today: string }}
	 */
	const { tasks, today } = $props()

	const open = $derived(tasks.filter((task) => task.status !== 'done'))
	const done = $derived(tasks.filter((task) => task.status === 'done'))
</script>

<OverviewCard
	id="tasks-heading"
	heading="Tasks today"
	meta={tasks.length ? `${done.length} of ${tasks.length} done` : ''}
>
	{#if tasks.length}
		<ul class="tasks-today">
			{#each [...open, ...done] as task (task.id)}
				<TaskRow {task} back="/overview" />
			{/each}
		</ul>
	{:else}
		<p class="tasks-today-quiet">
			Nothing planned. Give a task a date for today and it shows up here.
		</p>
	{/if}
	<a class="tasks-today-add" href="/agenda/add/task?date={today}">+ Add task</a>
</OverviewCard>

<style>
	.tasks-today {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tasks-today-quiet {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.5;
	}

	.tasks-today-add {
		display: flex;
		align-items: center;
		min-block-size: var(--size-touch);
		padding-inline: var(--space-s);
		border: var(--line-dashed);
		border-radius: var(--radius-item-small);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.tasks-today-add:hover {
		color: var(--color-text);
	}
</style>

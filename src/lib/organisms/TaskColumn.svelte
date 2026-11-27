<script>
	import TaskRow from '#lib/molecules/TaskRow.svelte'

	/**
	 * One day of tasks: TODO with an add row, open tasks, and the done ones folded away.
	 * @type {{
	 *   heading: string,
	 *   day: string,
	 *   open: import('#lib/agenda/lists.js').Task[],
	 *   done: import('#lib/agenda/lists.js').Task[],
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	const { heading, day, open, done, children } = $props()

	const dayLabel = $derived(
		new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(
			new Date(`${day}T12:00:00Z`)
		)
	)
</script>

<section class="task-column" aria-labelledby="tasks-{day}">
	<h2 id="tasks-{day}">{heading} <span>{dayLabel}</span></h2>
	<p class="task-column-label">Todo</p>
	<ul class="task-column-list">
		<li><a class="task-column-add" href="/agenda/add/task?date={day}">+ Add task</a></li>
		{#each open as task (task.id)}
			<TaskRow {task} />
		{/each}
	</ul>
	{#if done.length}
		<details class="task-column-done">
			<summary>Done <span>show {done.length}</span></summary>
			<ul class="task-column-list">
				{#each done as task (task.id)}
					<TaskRow {task} />
				{/each}
			</ul>
		</details>
	{/if}
	{@render children?.()}
</section>

<style>
	.task-column {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		min-inline-size: 0;
	}

	h2 {
		display: flex;
		align-items: baseline;
		gap: var(--space-xs);
		padding-block-end: var(--space-xs);
		border-block-end: var(--line-strong);
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}

	h2 span,
	.task-column-label,
	summary span {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 600;
	}

	.task-column-label {
		text-transform: uppercase;
	}

	.task-column-list {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.task-column-add {
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

	.task-column-add:hover {
		color: var(--color-text);
		border-color: var(--line-color);
	}

	summary {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		min-block-size: var(--size-touch);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
		cursor: pointer;
	}
</style>

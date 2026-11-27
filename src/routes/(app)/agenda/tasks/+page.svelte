<script>
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import TaskRow from '#lib/molecules/TaskRow.svelte'
	import TaskColumn from '#lib/organisms/TaskColumn.svelte'
	import { minutesText } from '#lib/agenda/lists.js'

	const { data } = $props()

	const dayName = (/** @type {string} */ day) =>
		new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(
			new Date(`${day}T12:00:00Z`)
		)
	const range = $derived(
		`${dayName(data.week[0].date)} to ${dayName(data.week[data.week.length - 1].date)}`
	)
</script>

<svelte:head><title>Tasks · CRE8</title></svelte:head>

<div class="tasks-heading">
	<h1>Tasks</h1>
	<span>{data.meta}</span>
</div>
<MascotBar />

<div class="tasks">
	<TaskColumn heading="Today" day={data.today.date} open={data.today.open} done={data.today.done} />
	<TaskColumn
		heading="Tomorrow"
		day={data.tomorrow.date}
		open={data.tomorrow.open}
		done={data.tomorrow.done}
	>
		{#if data.undated.length}
			<div class="tasks-undated" id="undated">
				{#if data.showUndated}
					<h3>
						{data.undated.length}
						{data.undated.length === 1 ? 'task' : 'tasks'} without a date
					</h3>
					<ul>
						{#each data.undated as task (task.id)}
							<TaskRow {task} />
						{/each}
					</ul>
					<a href="/agenda/tasks">Hide</a>
				{:else}
					<a href="?undated#undated">
						{data.undated.length}
						{data.undated.length === 1 ? 'task' : 'tasks'} without a date
					</a>
				{/if}
			</div>
		{/if}
	</TaskColumn>

	<section class="tasks-week" aria-labelledby="tasks-week">
		<h2 id="tasks-week">Coming days <span>{range}</span></h2>
		<ul>
			{#each data.week as day (day.date)}
				{@const total = day.open.reduce((sum, task) => sum + (task.estimated_minutes ?? 0), 0)}
				<li class="tasks-week-day">
					<span class="tasks-week-name">{dayName(day.date)}</span>
					<span class="tasks-week-text">
						{#if day.open.length}
							<a href="/agenda?date={day.date}">{day.open[0].title}</a>
							<small>
								{day.open.length}
								{day.open.length === 1 ? 'task' : 'tasks'}{total ? ` · ${minutesText(total)}` : ''}
							</small>
						{:else}
							<small>nothing yet</small>
						{/if}
					</span>
					<a
						class="tasks-week-add"
						href="/agenda/add/task?date={day.date}"
						aria-label="Add a task on {dayName(day.date)}"
					>
						+
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.tasks-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-s);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.tasks-heading span,
	h2 span,
	small {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		font-weight: 500;
	}

	.tasks {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
		gap: var(--space-xl);
		max-inline-size: var(--agenda-max-width);
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

	h3 {
		font-size: var(--font-size-agenda-label);
		text-transform: uppercase;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tasks-undated {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		padding-block-start: var(--space-s);
		font-size: var(--font-size-agenda-meta);
	}

	.tasks-undated a {
		color: var(--color-text);
		font-weight: 700;
	}

	.tasks-week {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
	}

	.tasks-week-day {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-s);
		border-block-end: var(--line-quiet);
	}

	.tasks-week-name {
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.tasks-week-text {
		display: flex;
		flex-direction: column;
		min-inline-size: 0;
	}

	.tasks-week-text a {
		overflow: hidden;
		color: var(--color-text);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tasks-week-add {
		display: grid;
		place-items: center;
		inline-size: var(--size-touch);
		block-size: var(--size-touch);
		color: var(--color-text);
		font-weight: 700;
		text-decoration: none;
	}
</style>

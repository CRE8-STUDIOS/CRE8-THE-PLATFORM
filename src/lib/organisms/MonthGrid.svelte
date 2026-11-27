<script>
	/**
	 * @type {{
	 *   cells: ReturnType<typeof import('#lib/agenda/grid.js').monthCells>,
	 *   label: string
	 * }}
	 */
	const { cells, label } = $props()

	const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<section class="month" aria-label={label}>
	<div class="month-grid">
		{#each WEEKDAYS as weekday (weekday)}
			<span class="month-weekday">{weekday}</span>
		{/each}
		{#each cells as cell (cell.date)}
			<div class="month-cell">
				<a
					class="month-day"
					class:outside={!cell.inMonth}
					class:today={cell.today}
					href="/agenda?date={cell.date}"
					aria-current={cell.today ? 'date' : undefined}
				>
					{cell.day}
				</a>
				{#each cell.items as item (`${item.id}${item.starts_at}`)}
					<a
						class="month-item"
						class:deadline={item.type === 'deadline'}
						href={item.href ?? `/agenda/${item.id}`}
					>
						{item.title}
					</a>
				{/each}
				{#if cell.more}
					<a class="month-item" href="/agenda?date={cell.date}">+{cell.more}</a>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.month {
		overflow-x: auto;
	}

	.month-grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		min-inline-size: 36rem;
		border-block-start: var(--line);
		border-inline-start: var(--line);
	}

	.month-weekday,
	.month-cell {
		border-inline-end: var(--line);
		border-block-end: var(--line);
	}

	.month-weekday {
		padding: var(--space-xs);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.month-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		min-block-size: var(--agenda-cell-height);
		min-inline-size: 0;
		padding: var(--space-xs);
	}

	.month-day {
		align-self: flex-start;
		padding: 1px 8px;
		border: var(--line-width) solid transparent;
		border-radius: var(--radius-pill);
		color: var(--color-text);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-heading);
		text-decoration: none;
	}

	.month-day.outside {
		color: var(--line-color-quiet);
	}

	.month-day.today {
		border-color: var(--line-color);
	}

	.month-item {
		overflow: hidden;
		color: var(--color-text);
		font-size: var(--font-size-agenda-label);
		font-weight: 600;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.month-item:hover {
		text-decoration: underline;
	}

	.month-item.deadline {
		font-weight: var(--font-weight-heading);
	}
</style>

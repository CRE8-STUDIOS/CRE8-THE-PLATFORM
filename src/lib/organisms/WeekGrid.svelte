<script>
	import { isFocus } from '#lib/agenda/timeline.js'
	import { formatTime } from '#lib/utils/dates.js'

	/**
	 * @type {{
	 *   layout: ReturnType<typeof import('#lib/agenda/grid.js').weekLayout>,
	 *   today: string,
	 *   timeZone: string,
	 *   label: string
	 * }}
	 */
	const { layout, today, timeZone, label } = $props()

	/** Header and all day rows come before the time slots */
	const FIRST_SLOT_ROW = 3

	const weekday = (/** @type {string} */ date) =>
		new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(
			new Date(`${date}T12:00:00Z`)
		)
</script>

<section class="week" aria-label={label}>
	<div class="week-grid" style:--slots={layout.slots}>
		{#each layout.days as day, index (day.date)}
			<a
				class="week-day"
				class:today={day.date === today}
				href="/agenda?date={day.date}"
				style:grid-column={index + 2}
				aria-current={day.date === today ? 'date' : undefined}
			>
				{weekday(day.date)} <span class="week-date">{Number(day.date.slice(8))}</span>
			</a>
			{#if day.allDay.length}
				<ul class="week-all-day" style:grid-column={index + 2}>
					{#each day.allDay as item (item.id)}
						<li class:deadline={item.type === 'deadline'}>
							<a href={item.href ?? `/agenda/${item.id}`}>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/each}

		{#each layout.hours as hour (hour.label)}
			<span class="week-hour" style:grid-row={FIRST_SLOT_ROW + hour.row - 1}>{hour.label}</span>
		{/each}

		{#each layout.days as day, index (day.date)}
			{#each day.placed as { item, row, span } (`${item.id}${item.starts_at}`)}
				<a
					class="week-item"
					class:focus={isFocus(item)}
					class:quiet={item.type === 'rest'}
					href="/agenda/{item.id}"
					style:grid-column={index + 2}
					style:grid-row="{FIRST_SLOT_ROW + row - 1} / span {span}"
				>
					<span class="visually-hidden">
						{weekday(day.date)}
						{formatTime(item.starts_at, timeZone)}{item.ends_at
							? ` to ${formatTime(item.ends_at, timeZone)}`
							: ''},
					</span>
					{item.title}
				</a>
			{/each}
		{/each}
	</div>
</section>

<style>
	.week {
		overflow-x: auto;
	}

	.week-grid {
		display: grid;
		grid-template-columns:
			3.5rem repeat(5, minmax(0, 1fr))
			repeat(2, minmax(0, 0.6fr));
		grid-template-rows: auto auto repeat(var(--slots), var(--agenda-slot-height));
		column-gap: var(--space-xs);
		min-inline-size: 40rem;
	}

	.week-day {
		grid-row: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		min-block-size: var(--size-touch);
		border-block-end: var(--line);
		color: var(--color-text);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.week-day.today {
		border-block-end: var(--line-strong);
	}

	.week-date {
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-heading);
	}

	.week-all-day {
		grid-row: 2;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		margin: 0;
		padding: var(--space-2xs) 0;
		list-style: none;
		font-size: var(--font-size-agenda-label);
	}

	.week-all-day a {
		color: var(--color-text);
	}

	.deadline {
		font-weight: var(--font-weight-heading);
	}

	.week-hour {
		grid-column: 1;
		padding-block-start: var(--space-2xs);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}

	.week-item {
		margin-block: 3px;
		padding: 6px 8px;
		overflow: hidden;
		border: var(--line);
		border-radius: var(--radius-item-small);
		color: var(--color-text);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-decoration: none;
	}

	.week-item:hover {
		text-decoration: underline;
	}

	.week-item.focus {
		border: var(--line-strong);
	}

	.week-item.quiet {
		border: var(--line-quiet);
	}
</style>

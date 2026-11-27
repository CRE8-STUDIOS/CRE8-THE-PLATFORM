<script>
	import AgendaRow from '#lib/molecules/AgendaRow.svelte'
	import AgendaGapRow from '#lib/molecules/AgendaGapRow.svelte'
	import { isFocus, subLine, typeLabel } from '#lib/agenda/timeline.js'
	import { formatTime } from '#lib/utils/dates.js'

	/**
	 * @type {{
	 *   rows: import('#lib/agenda/timeline.js').TimelineRow[],
	 *   allDay: import('#lib/agenda/timeline.js').AgendaItem[],
	 *   timeZone: string,
	 *   label: string
	 * }}
	 */
	const { rows, allDay, timeZone, label } = $props()

	const duration = (/** @type {number} */ minutes) => {
		const hours = Math.floor(minutes / 60)
		const rest = minutes % 60
		return [hours ? `${hours} h` : '', rest ? `${rest} min` : ''].filter(Boolean).join(' ')
	}
</script>

<section class="timeline" aria-label={label}>
	{#if rows.length || allDay.length}
		<ol class="timeline-rows">
			{#each allDay as item (item.id)}
				<AgendaRow
					time="All day"
					title={item.title}
					sub={subLine(item, timeZone)}
					label={typeLabel(item)}
					href={item.href ?? `/agenda/${item.id}`}
					done={item.status === 'done'}
				/>
			{/each}
			{#each rows as row, index (index)}
				{#if row.kind === 'item'}
					{@const item = row.item}
					<AgendaRow
						time={formatTime(row.start, timeZone)}
						title={item.title}
						sub={subLine(item, timeZone)}
						label={typeLabel(item)}
						href="/agenda/{item.id}"
						focus={isFocus(item)}
						quiet={item.type === 'rest'}
						done={item.status === 'done'}
					/>
				{:else if row.kind === 'travel'}
					<AgendaGapRow time={formatTime(row.start, timeZone)} text="{row.minutes} min travel" />
				{:else}
					<AgendaGapRow
						time={formatTime(row.start, timeZone)}
						text="Free · {duration(row.minutes)}"
					/>
				{/if}
			{/each}
		</ol>
	{:else}
		<p class="timeline-empty">Nothing planned for this day.</p>
	{/if}
</section>

<style>
	.timeline {
		max-inline-size: var(--agenda-max-width);
	}

	.timeline-rows {
		display: flex;
		flex-direction: column;
		gap: var(--agenda-row-gap);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.timeline-empty {
		padding: var(--agenda-item-padding);
		border: var(--line-dashed);
		border-radius: var(--radius-item);
		color: var(--color-text-calm);
	}
</style>

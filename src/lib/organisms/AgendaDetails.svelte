<script>
	import TypeLabel from '#lib/atoms/TypeLabel.svelte'
	import { typeLabel } from '#lib/agenda/timeline.js'
	import { formatDateTime, formatTime } from '#lib/utils/dates.js'

	/**
	 * Calm, read only summary of one agenda item.
	 * @type {{ item: import('#lib/database.types.js').Tables<'agenda_items'> & { projects?: { title: string } | null }, timeZone: string }}
	 */
	const { item, timeZone } = $props()

	const when = $derived.by(() => {
		if (!item.starts_at) return item.due_date ? `Due ${item.due_date}` : 'No date yet'
		if (item.all_day) return `${formatDateTime(item.starts_at, timeZone).split(',')[0]}, all day`
		const end = item.ends_at ? ` to ${formatTime(item.ends_at, timeZone)}` : ''
		return `${formatDateTime(item.starts_at, timeZone)}${end}`
	})

	const facts = $derived(
		/** @type {[string, string | null | undefined][]} */ ([
			['When', when],
			['Project', item.projects?.title],
			['Place', [item.location_name, item.address].filter(Boolean).join(', ')],
			[
				'Open',
				item.opens_at && item.closes_at
					? `${item.opens_at.slice(0, 5)} to ${item.closes_at.slice(0, 5)}`
					: null
			],
			[
				'Travel',
				[
					item.travel_before_minutes ? `${item.travel_before_minutes} min before` : '',
					item.travel_after_minutes ? `${item.travel_after_minutes} min after` : ''
				]
					.filter(Boolean)
					.join(', ')
			],
			['Repeats', item.recurrence_rule],
			['Protected', item.is_protected ? 'No client bookings in this block' : null]
		]).filter(([, value]) => value)
	)
</script>

<section class="details" aria-label="Summary">
	<TypeLabel>{typeLabel(item)}</TypeLabel>
	<dl class="details-facts">
		{#each facts as [term, value] (term)}
			<div>
				<dt>{term}</dt>
				<dd>{value}</dd>
			</div>
		{/each}
		{#if item.meeting_url}
			<div>
				<dt>Link</dt>
				<dd>
					<a href={item.meeting_url} rel="noopener noreferrer" target="_blank">Join the meeting</a>
				</dd>
			</div>
		{/if}
	</dl>
	{#if item.description}<p class="details-notes">{item.description}</p>{/if}
</section>

<style>
	.details {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		max-inline-size: var(--agenda-max-width);
		padding: var(--agenda-item-padding);
		border: var(--line);
		border-radius: var(--radius-item);
	}

	.details-facts {
		display: grid;
		gap: var(--space-xs);
		margin: 0;
	}

	.details-facts div {
		display: grid;
		grid-template-columns: 7rem minmax(0, 1fr);
		gap: var(--space-s);
	}

	dt {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		text-transform: uppercase;
	}

	dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.details-notes {
		padding-block-start: var(--space-s);
		border-block-start: var(--line-quiet);
		white-space: pre-line;
	}
</style>

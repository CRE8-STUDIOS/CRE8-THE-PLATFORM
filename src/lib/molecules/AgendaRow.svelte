<script>
	import TypeLabel from '#lib/atoms/TypeLabel.svelte'

	/**
	 * One item on the day timeline: time, then an outlined block with title,
	 * one quiet line and a type label. The block opens the details.
	 * @type {{ time: string, title: string, sub?: string, label: string, href: string, focus?: boolean, quiet?: boolean, done?: boolean }}
	 */
	const {
		time,
		title,
		sub = '',
		label,
		href,
		focus = false,
		quiet = false,
		done = false
	} = $props()
</script>

<li class="agenda-row">
	<span class="agenda-row-time">{time}</span>
	<a class={['agenda-row-item', { focus, quiet, done }]} {href}>
		<span class="agenda-row-text">
			<span class="agenda-row-title">{title}</span>
			{#if sub}<span class="agenda-row-sub">{sub}</span>{/if}
		</span>
		<TypeLabel>{label}</TypeLabel>
	</a>
</li>

<style>
	.agenda-row {
		display: grid;
		grid-template-columns: var(--agenda-time-column) minmax(0, 1fr);
		align-items: center;
		gap: var(--agenda-column-gap);
	}

	.agenda-row-time {
		color: var(--color-text-calm);
		font-size: var(--font-size-small);
		font-weight: 600;
	}

	.agenda-row-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
		padding: var(--agenda-item-padding);
		border: var(--line);
		border-radius: var(--radius-item);
		color: var(--color-text);
		text-decoration: none;
	}

	.agenda-row-item:hover .agenda-row-title {
		text-decoration: underline;
	}

	.focus {
		border: var(--line-strong);
	}

	.quiet {
		border: var(--line-quiet);
	}

	.done .agenda-row-title {
		text-decoration: line-through;
	}

	.agenda-row-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		min-inline-size: 0;
	}

	.agenda-row-title {
		font-size: var(--font-size-agenda-title);
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.agenda-row-sub {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	@media (width < 40rem) {
		.agenda-row {
			grid-template-columns: 1fr;
			gap: var(--space-2xs);
		}
	}
</style>

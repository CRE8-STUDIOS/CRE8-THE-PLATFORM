<script>
	/**
	 * A quiet dashed row for travel or free time.
	 * @type {{ time: string, text: string }}
	 */
	const { time, text } = $props()
</script>

<li class="agenda-gap">
	<span class="agenda-gap-time">{time}</span>
	<span class="agenda-gap-text">{text}</span>
</li>

<style>
	.agenda-gap {
		display: grid;
		grid-template-columns: var(--agenda-time-column) minmax(0, 1fr);
		align-items: center;
		gap: var(--agenda-column-gap);
	}

	.agenda-gap-time {
		color: var(--color-text-calm);
		font-size: var(--font-size-small);
	}

	.agenda-gap-text {
		padding: var(--agenda-gap-padding);
		border: var(--line-dashed);
		border-radius: var(--radius-item);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	@media (width < 40rem) {
		.agenda-gap {
			grid-template-columns: 1fr;
			gap: var(--space-2xs);
		}
	}
</style>

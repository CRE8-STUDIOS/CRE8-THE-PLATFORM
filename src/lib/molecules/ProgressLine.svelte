<script>
	/**
	 * A thin line with the part that is done drawn thicker, and "2 OF 8".
	 * @type {{ done: number, total: number }}
	 */
	const { done, total } = $props()
	const percent = $derived(total ? Math.round((done / total) * 100) : 0)
</script>

<div class="progress-line">
	<span class="progress-line-track" aria-hidden="true">
		<span style:inline-size="{percent}%"></span>
	</span>
	<span class="progress-line-text">{done} of {total}</span>
</div>

<style>
	.progress-line {
		display: flex;
		align-items: center;
		gap: var(--space-s);
	}

	.progress-line-track {
		position: relative;
		flex: 1;
		border-block-start: var(--line-quiet);
	}

	.progress-line-track span {
		position: absolute;
		inset-block-start: -0.125rem;
		inset-inline-start: 0;
		border-block-start: 0.1875rem solid var(--line-color);
	}

	.progress-line-text {
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
		white-space: nowrap;
	}
</style>

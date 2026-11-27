<script>
	/**
	 * The top of a lesson: which lesson, its title and the way back.
	 * @type {{ number: number, total: number, minutes: number, title: string }}
	 */
	const { number, total, minutes, title } = $props()
</script>

<div class="lesson-heading">
	<div>
		<span class="lesson-heading-meta">Lesson {number} of {total} · {minutes} min</span>
		<h1>{title}</h1>
	</div>
	<a href="/guide/money">All lessons</a>
</div>

<style>
	.lesson-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-m);
	}

	.lesson-heading div {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.lesson-heading-meta {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

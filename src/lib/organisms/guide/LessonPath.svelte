<script>
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'

	/**
	 * The money lessons as a path: a numbered circle per lesson on one thin
	 * line, done ones with a check, the current one with START.
	 * @type {{ lessons: { slug: string, title: string, summary: string, minutes: number, number: number, state: 'done' | 'current' | 'todo', step: number }[] }}
	 */
	const { lessons } = $props()
</script>

<ol class="lesson-path">
	{#each lessons as lesson (lesson.slug)}
		<li class="lesson-path-item is-{lesson.state}">
			<span class="lesson-path-mark" aria-hidden="true">
				{lesson.state === 'done' ? '✓' : lesson.number}
			</span>
			<a class="lesson-path-link" href="/guide/money/{lesson.slug}">
				<span class="lesson-path-title">{lesson.title}</span>
				<span class="lesson-path-summary">{lesson.summary}</span>
			</a>
			{#if lesson.state === 'done'}
				<span class="lesson-path-state">Done</span>
			{:else if lesson.state === 'current'}
				<OutlineButton
					href="/guide/money/{lesson.slug}"
					strong
					aria-label="{lesson.step ? 'Continue' : 'Start'} {lesson.title}"
				>
					{lesson.step ? 'Continue' : 'Start'}
				</OutlineButton>
			{:else}
				<span class="lesson-path-minutes">{lesson.minutes} min</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.lesson-path {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.lesson-path-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding-block: var(--space-s);
	}

	/* The thin line that connects the circles */
	.lesson-path-item:not(:last-child)::before {
		position: absolute;
		inset-block: calc(var(--space-s) + var(--size-touch)) calc(var(--space-s) * -1);
		inset-inline-start: calc(var(--size-touch) / 2);
		border-inline-start: var(--line-quiet);
		content: '';
	}

	.lesson-path-mark {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		inline-size: var(--size-touch);
		block-size: var(--size-touch);
		border: var(--line);
		border-radius: var(--radius-pill);
		font-size: var(--font-size-agenda-meta);
		font-weight: 800;
	}

	.is-current .lesson-path-mark {
		border: var(--line-strong);
	}

	.is-todo .lesson-path-mark {
		border-color: var(--line-color-quiet);
		color: var(--color-text-calm);
	}

	.lesson-path-link {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-2xs);
		min-inline-size: 0;
		color: var(--color-text);
		text-decoration: none;
	}

	.lesson-path-link:hover .lesson-path-title {
		text-decoration: underline;
	}

	.lesson-path-title {
		font-size: var(--font-size-agenda-title);
		font-weight: 700;
	}

	.lesson-path-summary,
	.lesson-path-minutes {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.lesson-path-state {
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

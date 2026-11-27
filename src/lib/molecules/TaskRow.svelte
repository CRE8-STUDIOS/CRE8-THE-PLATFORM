<script>
	import { minutesText } from '#lib/agenda/lists.js'

	/**
	 * A task: a check button, title, time as a quiet line, and the priority word.
	 * The check is a form, so it works without JavaScript.
	 * @type {{ task: import('#lib/agenda/lists.js').Task }}
	 */
	const { task } = $props()

	const done = $derived(task.status === 'done')
	const PRIORITY = /** @type {Record<string, string>} */ ({
		must: 'Must',
		should: 'Should',
		could: 'Could',
		wont: "Won't"
	})
</script>

<li class="task-row" class:done>
	<form method="POST" action="/agenda/tasks?/done">
		<input type="hidden" name="id" value={task.id} />
		<button
			class="task-check"
			name="status"
			value={done ? 'open' : 'done'}
			role="checkbox"
			aria-checked={done}
			aria-label={done ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
		>
			{#if done}<svg viewBox="0 0 12 12" aria-hidden="true">
					<path d="M2 6.5l2.5 2.5L10 3.5" />
				</svg>{/if}
		</button>
	</form>
	<a class="task-text" href="/agenda/{task.id}">
		<span class="task-title">{task.title}</span>
		{#if task.estimated_minutes}<span class="task-time">
				{minutesText(task.estimated_minutes)}
			</span>{/if}
	</a>
	{#if task.priority}
		<span class="task-priority" data-tour="priority" class:must={task.priority === 'must'}>
			{PRIORITY[task.priority]}
		</span>
	{/if}
</li>

<style>
	.task-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-s);
		padding-block: var(--space-xs);
		border-block-end: var(--line-quiet);
	}

	form {
		display: flex;
	}

	.task-check {
		display: grid;
		place-items: center;
		inline-size: var(--size-touch);
		block-size: var(--size-touch);
		margin: calc((var(--size-touch) - 1.375rem) / -2);
		padding: calc((var(--size-touch) - 1.375rem) / 2);
		border: 0;
		background: none;
		cursor: pointer;
	}

	.task-check::before {
		content: '';
		grid-area: 1 / 1;
		inline-size: 1.375rem;
		block-size: 1.375rem;
		border: var(--line);
		border-radius: 50%;
	}

	.task-check svg {
		grid-area: 1 / 1;
		inline-size: 0.75rem;
		block-size: 0.75rem;
		fill: none;
		stroke: var(--color-text);
		stroke-width: 1.5;
	}

	.task-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-inline-size: 0;
		color: var(--color-text);
		text-decoration: none;
	}

	.task-text:hover .task-title {
		text-decoration: underline;
	}

	.task-title {
		font-size: var(--font-size-small);
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.done .task-title {
		color: var(--color-text-calm);
		text-decoration: line-through;
	}

	.task-time {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.task-priority {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 600;
		letter-spacing: var(--letter-spacing-label);
		text-transform: uppercase;
	}

	.task-priority.must {
		color: var(--color-text);
		font-weight: var(--font-weight-heading);
	}
</style>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * @type {{
	 *   monday: string, previousWeek: string, nextWeek: string, timeZone: string,
	 *   week: { date: string, label: string, items: { id: string, type: string, title: string, starts_at: string | null, ends_at: string | null, all_day: boolean, status: string, is_protected: boolean, projects: { title: string } | null }[] }[]
	 * }}
	 */
	const { monday, previousWeek, nextWeek, week, timeZone } = $props()
</script>

<section class="agenda-week card rough-edge span-full">
	<header class="agenda-week-header">
		<Heading>Week of {monday}</Heading>
		<nav aria-label="Weeks">
			<ul class="pill-list">
				<li><a class="pill-link" href="?week={previousWeek}">Previous week</a></li>
				<li><a class="pill-link" href="/agenda">This week</a></li>
				<li><a class="pill-link" href="?week={nextWeek}">Next week</a></li>
			</ul>
		</nav>
	</header>

	<div class="agenda-week-scroll">
		<ol class="agenda-week-grid">
			{#each week as { date, label, items } (date)}
				<li class="agenda-week-day">
					<Heading level={3}>{label}</Heading>
					<ul class="agenda-week-items">
						{#each items as { id, type, title, starts_at, ends_at, all_day, status, is_protected, projects } (id)}
							<li
								class="agenda-block agenda-block-{type}"
								class:agenda-block-done={status === 'done'}
							>
								<span class="agenda-block-time">
									{#if all_day}All day{:else}<DateTime
											value={starts_at}
											{timeZone}
											show="time"
										/>{#if ends_at}{' '}to <DateTime
												value={ends_at}
												{timeZone}
												show="time"
											/>{/if}{/if}
								</span>
								<a class="agenda-block-title" href="/agenda/{id}">{title}</a>
								<span class="agenda-block-meta">
									{type}{#if is_protected}
										(locked){/if}{#if projects}
										· {projects.title}{/if}
								</span>
								{#if type === 'task' || type === 'errand'}
									<ActionButton
										action="?/toggleDone"
										label={status === 'done' ? 'Done' : 'Mark done'}
										fields={{ id, status }}
									/>
								{/if}
							</li>
						{:else}
							<li class="agenda-week-empty">Nothing planned.</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.agenda-week-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.agenda-week-scroll {
		overflow-x: auto;
		padding-block-end: var(--space-xs);
	}

	.agenda-week-grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(var(--size-agenda-day), 1fr));
		gap: var(--space-xs);
		padding: 0;
		list-style: none;
	}

	.agenda-week-day {
		display: grid;
		min-inline-size: 0;
		align-content: start;
		gap: var(--space-xs);
		padding-inline-end: var(--space-xs);
		border-inline-end: var(--border-width-thin) solid var(--color-border-divider);
	}

	.agenda-week-day:last-child {
		border-inline-end: none;
	}

	.agenda-week-items {
		display: grid;
		gap: var(--space-xs);
		padding: 0;
		list-style: none;
	}

	.agenda-block {
		display: grid;
		gap: var(--space-2xs);
		padding: var(--space-xs);
		border-radius: var(--radius-small);
		background-color: var(--color-button-secondary);
		color: var(--color-text);
		font-size: var(--font-size-small);
		line-height: var(--line-height-heading);
	}

	.agenda-block-work {
		background-color: var(--color-status-progress);
	}

	.agenda-block-meeting {
		background-color: var(--color-status-editing);
	}

	.agenda-block-shoot {
		background-color: var(--color-status-pending);
	}

	.agenda-block-deadline {
		background-color: var(--color-status-overdue);
	}

	.agenda-block-rest {
		background-color: var(--color-status-paid);
	}

	.agenda-block-task {
		background-color: var(--color-status-draft);
	}

	.agenda-block-done {
		opacity: 0.6;
	}

	.agenda-block-time {
		font-family: var(--font-family-display);
		font-size: var(--font-size-tag);
		letter-spacing: var(--letter-spacing-display);
	}

	.agenda-week-day :global(.heading-3) {
		overflow-wrap: anywhere;
	}

	.agenda-block-title {
		overflow-wrap: anywhere;
	}

	.agenda-block :global(.button) {
		min-block-size: auto;
		padding-block: var(--space-2xs);
		padding-inline: var(--space-xs);
		font-size: var(--font-size-tag);
		white-space: normal;
	}

	.agenda-block-meta {
		font-size: var(--font-size-label);
	}

	.agenda-week-empty {
		color: var(--color-text-muted);
		font-size: var(--font-size-small);
	}
</style>

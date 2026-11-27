<script>
	/**
	 * The active projects as a row of outlined cards that scrolls sideways.
	 * The row can be focused and scrolled with the arrow keys.
	 * @type {{ projects: { id: string, title: string, stage: string, client: string, deadline: string | null, next: string | null }[] }}
	 */
	const { projects } = $props()

	const day = (/** @type {string} */ ymd) =>
		new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
			new Date(`${ymd}T12:00:00Z`)
		)
</script>

<section class="active-projects" aria-labelledby="active-projects-heading">
	<div class="active-projects-heading">
		<h2 id="active-projects-heading">Active projects</h2>
		<a href="/projects">{projects.length ? `All ${projects.length}` : 'All projects'}</a>
	</div>
	{#if projects.length}
		<!-- The row scrolls sideways, so it has to be reachable with the keyboard -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<ul class="active-projects-row" tabindex="0" aria-label="Active projects, scroll sideways">
			{#each projects as project (project.id)}
				<li>
					<a href="/projects/{project.id}">
						<span class="active-project-top">
							<span class="active-project-title">{project.title}</span>
							<span class="active-project-stage">{project.stage}</span>
						</span>
						<span class="active-project-line">
							{project.client} · {project.deadline
								? `deadline ${day(project.deadline)}`
								: 'no deadline'}
						</span>
						{#if project.next}<span class="active-project-next">Next: {project.next}</span>{/if}
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="active-projects-quiet">
			No active projects right now. <a href="/projects">Start or open a project</a>
		</p>
	{/if}
</section>

<style>
	.active-projects {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		min-inline-size: 0;
	}

	.active-projects-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-xs);
		border-block-end: var(--line);
	}

	h2 {
		font-size: var(--font-size-agenda-meta);
		font-weight: 800;
		text-transform: uppercase;
	}

	.active-projects-heading a,
	.active-projects-quiet a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.active-projects-row {
		display: grid;
		grid-auto-columns: minmax(15rem, 1fr);
		grid-auto-flow: column;
		gap: var(--space-m);
		margin: 0;
		padding: 0 0 var(--space-xs);
		overflow-x: auto;
		list-style: none;
		scroll-snap-type: x mandatory;
	}

	.active-projects-row:focus-visible {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}

	.active-projects-row li {
		display: grid;
		scroll-snap-align: start;
	}

	.active-projects-row a {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		padding: var(--space-m);
		border: var(--line);
		border-radius: var(--radius-item);
		color: var(--color-text);
		text-decoration: none;
	}

	.active-projects-row a:hover .active-project-title {
		text-decoration: underline;
	}

	.active-project-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-xs);
	}

	.active-project-title {
		font-size: var(--font-size-small);
		font-weight: 800;
	}

	.active-project-stage {
		flex: none;
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.active-project-line,
	.active-projects-quiet {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.active-project-next {
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

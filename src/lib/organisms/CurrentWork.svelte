<script>
	/** @type {{ clock: { project_id: string | null, projects: { title: string } | null } | null }} */
	const { clock } = $props()
</script>

<section class="current-work card rough-edge" aria-labelledby="current-work-label">
	<div class="current-work-text">
		<h2 id="current-work-label" class="label text-muted">Now</h2>
		{#if clock?.projects}
			<p class="current-work-project">{clock.projects.title}</p>
		{:else}
			<p class="current-work-project">No project running</p>
		{/if}
	</div>
	{#if clock?.projects}
		<a class="button button-primary" href="/projects/{clock.project_id}">Open project</a>
	{/if}
</section>

<style>
	.current-work {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.current-work > * + * {
		margin-block-start: 0;
	}

	.current-work-text {
		display: grid;
		gap: var(--space-xs);
	}

	.current-work-project {
		font-family: var(--font-family-display);
		font-size: var(--font-size-project);
		line-height: var(--line-height-heading);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}
</style>

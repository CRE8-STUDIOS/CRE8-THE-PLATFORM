<script>
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import BoardColumn from '#lib/organisms/BoardColumn.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Project board · CRE8</title></svelte:head>

<div class="board-heading">
	<div>
		<h1>{data.project?.title ?? 'Project board'}</h1>
		{#if data.project?.meta}<span>{data.project.meta}</span>{/if}
	</div>
	{#if data.project}
		<form class="board-select" method="GET">
			<label for="board-project">Project</label>
			<select
				id="board-project"
				name="project"
				onchange={(event) => event.currentTarget.form?.requestSubmit()}
			>
				{#each data.projects as project (project.value)}
					<option value={project.value} selected={project.value === data.project.id}>
						{project.label}
					</option>
				{/each}
			</select>
			<noscript><OutlineButton>Show</OutlineButton></noscript>
		</form>
	{/if}
</div>

{#if data.project}
	<MascotBar />
{:else}
	<MascotBar message="No active project yet. Start one and its cards land here.">
		{#snippet actions()}
			<OutlineButton href="/projects" strong>Projects</OutlineButton>
		{/snippet}
	</MascotBar>
{/if}

<div class="board">
	{#each data.columns as column (column.heading)}
		<BoardColumn heading={column.heading} cards={column.cards} />
	{/each}
</div>
<p class="board-note">Cards in review are visible to your client in the portal.</p>

<style>
	.board-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-m);
	}

	.board-heading div {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-s);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.board-heading span,
	.board-note {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.board-select {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	label {
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
	}

	select {
		min-block-size: var(--size-touch);
		padding-inline: var(--space-s);
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
	}

	.board {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
		gap: var(--space-m);
		max-inline-size: var(--agenda-max-width);
	}
</style>

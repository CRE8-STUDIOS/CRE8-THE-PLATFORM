<script>
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import ToolCard from '#lib/molecules/ToolCard.svelte'
	import WorkspaceTile from '#lib/molecules/WorkspaceTile.svelte'
	import WorkspaceLinks from '#lib/organisms/WorkspaceLinks.svelte'
	import WorkspaceEmpty from '#lib/molecules/WorkspaceEmpty.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Workspace · CRE8</title></svelte:head>

<div class="workspace">
	<div class="workspace-heading">
		<h1>Workspace</h1>
	</div>

	<CalmSection id="tools-heading" heading="Tools">
		<ul class="workspace-tools">
			{#each data.tools as tool (tool.name)}
				<li><ToolCard {...tool} /></li>
			{/each}
		</ul>
	</CalmSection>

	<CalmSection id="apps-heading" heading="My apps">
		{#snippet aside()}
			{#if data.apps.length}<a href="/workspace?edit">Edit</a>{/if}
		{/snippet}
		{#if data.apps.length}
			<ul class="workspace-apps">
				{#each data.apps as app (app.id)}
					<li><WorkspaceTile name={app.name} iconUrl={app.iconUrl} href={app.url} /></li>
				{/each}
				<li>
					<a class="workspace-add-app" href="/workspace/apps/new">
						<span class="workspace-add-app-icon" aria-hidden="true">+</span>
						<span>Add app</span>
					</a>
				</li>
			</ul>
		{:else}
			<WorkspaceEmpty href="/workspace/apps/new" />
		{/if}
	</CalmSection>

	<CalmSection id="links-heading" heading="Important links" class="workspace-links-section">
		{#snippet aside()}
			<a href="/workspace/links/new">+ Add link</a>
		{/snippet}
		{#if data.links.length}
			<WorkspaceLinks links={data.links} />
		{:else}
			<p class="workspace-quiet">
				No links yet. Save the pages you keep looking for, like the Belastingdienst or your price
				list.
			</p>
		{/if}
	</CalmSection>
</div>

<style>
	.workspace {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		max-inline-size: var(--agenda-max-width);
	}

	.workspace-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.workspace-tools {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: var(--space-m);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.workspace-tools li {
		display: grid;
	}

	.workspace-apps {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
		gap: var(--space-l) var(--space-m);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.workspace-add-app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.workspace-add-app:hover span:last-child {
		text-decoration: underline;
	}

	.workspace-add-app-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		inline-size: 5.5rem;
		block-size: 5.5rem;
		border: var(--line-dashed);
		border-radius: 1.375rem;
		font-size: 1.75rem;
		font-weight: 400;
	}

	.workspace-quiet {
		padding-block: var(--space-xs);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.workspace :global(.workspace-links-section) {
		max-inline-size: 47.5rem;
	}
</style>

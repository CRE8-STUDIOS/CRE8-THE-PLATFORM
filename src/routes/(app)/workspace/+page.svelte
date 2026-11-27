<script>
	import { page } from '$app/state'
	import { goto, invalidateAll, preloadData, pushState } from '$app/navigation'
	import SidePanel from '#lib/organisms/SidePanel.svelte'
	import WorkspaceTileForm from '#lib/organisms/WorkspaceTileForm.svelte'
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import ToolCard from '#lib/molecules/ToolCard.svelte'
	import WorkspaceTile from '#lib/molecules/WorkspaceTile.svelte'
	import WorkspaceLinks from '#lib/organisms/WorkspaceLinks.svelte'
	import WorkspaceEmpty from '#lib/molecules/WorkspaceEmpty.svelte'

	const { data } = $props()

	/** @type {HTMLElement | null} */
	let opener = null

	/**
	 * Opens an add or change form in the side panel. Without JavaScript, or
	 * when the data cannot be loaded, the link goes to its own page.
	 * @param {MouseEvent} event
	 */
	const openPanel = async (event) => {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
		const link = /** @type {HTMLAnchorElement} */ (event.currentTarget)
		event.preventDefault()
		opener = link
		const href = link.getAttribute('href') ?? ''
		const result = await preloadData(href)
		if (result.type !== 'loaded' || result.status !== 200) return goto(href)
		pushState(href, { tile: { href, data: result.data.form } })
	}

	/** Closes the panel and puts focus back on what opened it */
	const closePanel = () => {
		const back = opener
		opener = null
		addEventListener('popstate', () => requestAnimationFrame(() => back?.focus()), { once: true })
		history.back()
	}

	/** The form props the panel shows, kept as plain data in the history state */
	const panelForm = $derived(
		/** @type {import('svelte').ComponentProps<typeof WorkspaceTileForm>} */ (page.state.tile?.data)
	)

	/** After saving: close the panel and show the new data */
	const donePanel = () => {
		addEventListener('popstate', () => invalidateAll(), { once: true })
		closePanel()
	}
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
					<a class="workspace-add-app" href="/workspace/apps/new" onclick={openPanel}>
						<span class="workspace-add-app-icon" aria-hidden="true">+</span>
						<span>Add app</span>
					</a>
				</li>
			</ul>
		{:else}
			<WorkspaceEmpty href="/workspace/apps/new" onclick={openPanel} />
		{/if}
	</CalmSection>

	<CalmSection id="links-heading" heading="Important links">
		{#snippet aside()}
			<a href="/workspace/links/new" onclick={openPanel}>+ Add link</a>
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

{#if page.state.tile}
	<SidePanel label={page.state.tile.data.heading} onclose={closePanel}>
		<WorkspaceTileForm
			{...panelForm}
			onclose={(event) => {
				event.preventDefault()
				closePanel()
			}}
			ondone={donePanel}
		/>
	</SidePanel>
{/if}

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
</style>

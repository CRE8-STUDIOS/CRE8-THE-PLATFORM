<script>
	import { page } from '$app/state'
	import { goto, invalidateAll, preloadData, pushState } from '$app/navigation'
	import SidePanel from '#lib/organisms/SidePanel.svelte'
	import WorkspaceTileForm from '#lib/organisms/WorkspaceTileForm.svelte'
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import ToolCard from '#lib/molecules/ToolCard.svelte'
	import WorkspaceApps from '#lib/organisms/WorkspaceApps.svelte'
	import MascotBar from '#lib/molecules/MascotBar.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import WorkspaceLinks from '#lib/organisms/WorkspaceLinks.svelte'
	import WorkspaceEmpty from '#lib/molecules/WorkspaceEmpty.svelte'

	const { data, form } = $props()

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
		{#if data.edit}<OutlineButton href="/workspace" strong>Done</OutlineButton>{/if}
	</div>

	{#if data.removing}
		{@const removing = data.removing}
		<MascotBar message="Remove {removing.name} from your workspace?">
			{#snippet actions()}
				<form method="POST" action="?/remove">
					<input type="hidden" name="id" value={removing.id} />
					<OutlineButton strong>Remove</OutlineButton>
				</form>
				<OutlineButton href="/workspace?edit">Keep</OutlineButton>
			{/snippet}
		</MascotBar>
	{:else if form?.message}
		<MascotBar message={form.message} />
	{/if}

	{#if data.edit}
		<p class="workspace-hint">
			Drag an app to change the order, or use its arrows to move it left or right. Click an app to
			change its name, link or icon.
		</p>
	{:else}
		<CalmSection id="tools-heading" heading="Tools">
			<ul class="workspace-tools">
				{#each data.tools as tool (tool.name)}
					<li><ToolCard {...tool} /></li>
				{/each}
			</ul>
		</CalmSection>
	{/if}

	<CalmSection id="apps-heading" heading="My apps">
		{#snippet aside()}
			{#if data.edit}
				<span>{data.apps.length} {data.apps.length === 1 ? 'app' : 'apps'}</span>
			{:else if data.apps.length}
				<a href="/workspace?edit">Edit</a>
			{/if}
		{/snippet}
		{#if data.apps.length}
			<WorkspaceApps apps={data.apps} edit={data.edit} onopen={openPanel} />
		{:else}
			<WorkspaceEmpty href="/workspace/apps/new" onclick={openPanel} />
		{/if}
	</CalmSection>

	<CalmSection id="links-heading" heading="Important links">
		{#snippet aside()}
			<a href="/workspace/links/new" onclick={openPanel}>+ Add link</a>
		{/snippet}
		{#if data.links.length}
			<WorkspaceLinks links={data.links}>
				{#snippet row(link)}
					{#if data.edit}
						<a
							class="workspace-link-remove"
							href="/workspace?edit&remove={link.id}"
							aria-label="Remove {link.name}"
						>
							<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2 2 10" /></svg>
						</a>
					{:else}
						<span class="workspace-link-arrow" aria-hidden="true">↗</span>
					{/if}
				{/snippet}
			</WorkspaceLinks>
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

	.workspace-hint {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.workspace-link-remove {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		inline-size: 2rem;
		block-size: 2rem;
		border: var(--line);
		border-radius: var(--radius-pill);
		color: var(--color-text);
	}

	.workspace-link-remove svg {
		inline-size: 0.625rem;
		block-size: 0.625rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}

	.workspace-quiet {
		padding-block: var(--space-xs);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

<script>
	import { enhance } from '$app/forms'
	import WorkspaceTile from '#lib/molecules/WorkspaceTile.svelte'
	import { moveItem } from '#lib/workspace/tiles.js'

	/**
	 * The app grid. In edit mode the tiles open their settings, get a remove
	 * link and move buttons, and can be dragged. Every change of order is
	 * saved in one form, so the buttons also work without JavaScript. The
	 * buttons at the ends stay focusable, so focus is not lost after a move.
	 * @type {{
	 *   apps: import('#lib/server/workspace.js').App[],
	 *   edit?: boolean,
	 *   onopen?: (event: MouseEvent) => void
	 * }}
	 */
	const { apps, edit = false, onopen } = $props()

	/** The order on screen, changed while dragging and reset by new data */
	let order = $derived(apps)
	/** @type {number | null} */
	let dragging = $state(null)

	/** @type {HTMLFormElement | undefined} */
	let form = $state()

	const dragStart = (/** @type {DragEvent} */ event, /** @type {number} */ index) => {
		dragging = index
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move'
			event.dataTransfer.setData('text/plain', order[index].id)
		}
	}

	const dragOver = (/** @type {DragEvent} */ event, /** @type {number} */ index) => {
		if (dragging === null) return
		event.preventDefault()
		if (index === dragging) return
		order = moveItem(order, dragging, index)
		dragging = index
	}

	const drop = (/** @type {DragEvent} */ event) => {
		event.preventDefault()
		if (dragging === null) return
		dragging = null
		form?.requestSubmit()
	}
</script>

{#if edit}
	<form
		bind:this={form}
		method="POST"
		action="?/reorder"
		use:enhance={() =>
			async ({ update }) =>
				update({ reset: false })}
	>
		<ul class="workspace-apps">
			{#each order as app, index (app.id)}
				<li
					class="workspace-app is-editing"
					class:is-dragging={dragging === index}
					draggable="true"
					ondragstart={(event) => dragStart(event, index)}
					ondragover={(event) => dragOver(event, index)}
					ondrop={drop}
					ondragend={() => (dragging = null)}
				>
					<input type="hidden" name="order" value={app.id} />
					<WorkspaceTile
						name={app.name}
						iconUrl={app.iconUrl}
						href="/workspace/apps/{app.id}"
						external={false}
						dashed
						onclick={onopen}
					/>
					<a
						class="workspace-app-remove"
						href="/workspace?edit&remove={app.id}"
						aria-label="Remove {app.name}"
					>
						<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2 2 10" /></svg>
					</a>
					<div class="workspace-app-moves">
						<button
							name="move"
							value="{app.id}:left"
							aria-label="Move {app.name} left"
							aria-disabled={index === 0 ? 'true' : undefined}
						>
							<span aria-hidden="true">‹</span>
						</button>
						<button
							name="move"
							value="{app.id}:right"
							aria-label="Move {app.name} right"
							aria-disabled={index === order.length - 1 ? 'true' : undefined}
						>
							<span aria-hidden="true">›</span>
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</form>
{:else}
	<ul class="workspace-apps">
		{#each apps as app (app.id)}
			<li class="workspace-app">
				<WorkspaceTile name={app.name} iconUrl={app.iconUrl} href={app.url} />
			</li>
		{/each}
		<li class="workspace-app">
			<a class="workspace-add-app" href="/workspace/apps/new" onclick={onopen}>
				<span class="workspace-add-app-icon" aria-hidden="true">+</span>
				<span>Add app</span>
			</a>
		</li>
	</ul>
{/if}

<style>
	.workspace-apps {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
		gap: var(--space-l) var(--space-m);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.workspace-app {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
	}

	.is-editing {
		cursor: grab;
	}

	.is-dragging {
		opacity: 0.4;
	}

	.workspace-app-remove {
		position: absolute;
		inset-block-start: calc(var(--space-s) * -1);
		inset-inline-end: calc(50% - 3.75rem);
		display: flex;
		align-items: center;
		justify-content: center;
		inline-size: 2rem;
		block-size: 2rem;
		border: var(--line);
		border-radius: var(--radius-pill);
		background-color: var(--color-background);
		color: var(--color-text);
	}

	.workspace-app-remove::before {
		position: absolute;
		inset: -0.375rem;
		content: '';
	}

	.workspace-app-remove svg {
		inline-size: 0.625rem;
		block-size: 0.625rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}

	.workspace-app-moves {
		display: flex;
		gap: var(--space-2xs);
	}

	.workspace-app-moves button {
		inline-size: 2rem;
		block-size: 2rem;
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--color-text);
		font-size: var(--font-size-small);
		line-height: 1;
		cursor: pointer;
	}

	.workspace-app-moves button[aria-disabled='true'] {
		border-color: var(--line-color-quiet);
		color: var(--line-color-quiet);
		cursor: default;
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
		border: var(--line);
		border-style: dashed;
		border-color: var(--line-color-quiet);
		border-radius: 1.375rem;
		font-size: 1.75rem;
		font-weight: 400;
	}
</style>

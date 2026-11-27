<script>
	import { page } from '$app/state'
	import { goto, preloadData, pushState } from '$app/navigation'
	import AgendaTabs from '#lib/molecules/AgendaTabs.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import AddPanel from '#lib/organisms/AddPanel.svelte'

	const { children } = $props()

	/** @type {HTMLElement | null} */
	let opener = null

	/**
	 * Opens a step of the add flow over the current page. Falls back to a
	 * normal page load when the data cannot be preloaded.
	 * @param {MouseEvent} event
	 * @param {string} href
	 */
	const openAdd = async (event, href) => {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
		event.preventDefault()
		opener ??= /** @type {HTMLElement} */ (document.activeElement)
		const result = await preloadData(href)
		if (result.type !== 'loaded' || result.status !== 200) return goto(href)
		// Page state has to be plain data, so only what the panel shows is kept
		const { type, answers, context, projects, query } = result.data
		pushState(href, {
			add: {
				href,
				depth: (page.state.add?.depth ?? 0) + 1,
				data: { type, answers, context, projects, query }
			}
		})
	}

	const closeAdd = () => {
		const back = opener
		opener = null
		// Focus goes back to ADD once the history step is done
		addEventListener('popstate', () => requestAnimationFrame(() => back?.focus()), { once: true })
		history.go(-(page.state.add?.depth ?? 1))
	}
</script>

<div class="agenda">
	<div class="agenda-bar">
		<AgendaTabs current={page.url.pathname} />
		<OutlineButton
			href="/agenda/add"
			data-tour="add"
			aria-label="Add to agenda"
			onclick={(/** @type {MouseEvent} */ event) => openAdd(event, '/agenda/add')}
		>
			<svg class="agenda-add-icon" viewBox="0 0 14 14" aria-hidden="true">
				<path d="M7 1v12M1 7h12" />
			</svg>
			Add
		</OutlineButton>
	</div>
	{@render children()}
</div>

{#if page.state.add}
	<AddPanel panel={page.state.add} onchoose={openAdd} onclose={closeAdd} />
{/if}

<style>
	.agenda {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		min-inline-size: 0;
	}

	.agenda-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
	}

	.agenda-add-icon {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}
</style>

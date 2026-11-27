<script>
	import AddChooser from '#lib/organisms/add/AddChooser.svelte'
	import { ADD_FORMS } from '#lib/organisms/add/forms.js'

	/**
	 * The add flow in a native dialog that slides in from the right.
	 * Escape, the close button and the backdrop close it.
	 * @type {{
	 *   panel: { href: string, depth: number, data: Record<string, any> },
	 *   onchoose: (event: MouseEvent, href: string) => void,
	 *   onclose: () => void
	 * }}
	 */
	const { panel, onchoose, onclose } = $props()

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state()

	$effect(() => {
		if (dialog && !dialog.open) dialog.showModal()
	})

	const close = (/** @type {Event} */ event) => {
		event.preventDefault()
		onclose()
	}

	const Form = $derived(
		panel.data.type ? ADD_FORMS[/** @type {keyof typeof ADD_FORMS} */ (panel.data.type)] : null
	)
</script>

<dialog
	bind:this={dialog}
	class="add-panel"
	aria-label="Add to agenda"
	oncancel={close}
	onclick={(event) => {
		if (event.target === dialog) close(event)
	}}
>
	<div class="add-panel-inner">
		{#if Form}
			<Form
				action="/agenda/add/{panel.data.type}?/{panel.data.type}"
				answers={panel.data.answers}
				context={panel.data.context}
				projects={panel.data.projects}
				changeTypeHref="/agenda/add{panel.data.query}"
				closeHref="/agenda"
				onclose={close}
				onchangetype={(event) => {
					if (panel.depth > 1) {
						event.preventDefault()
						history.back()
					} else onchoose(event, `/agenda/add${panel.data.query ?? ''}`)
				}}
			/>
		{:else}
			<AddChooser
				hrefFor={(type) => `/agenda/add/${type}${panel.data.query ?? ''}`}
				closeHref="/agenda"
				onchoose={(event, type) => onchoose(event, `/agenda/add/${type}${panel.data.query ?? ''}`)}
				onclose={close}
			/>
		{/if}
	</div>
</dialog>

<style>
	.add-panel {
		position: fixed;
		inset-block: 0;
		inset-inline: auto 0;
		inline-size: min(35rem, 100%);
		max-inline-size: 100%;
		block-size: 100dvh;
		max-block-size: 100dvh;
		margin: 0;
		padding: 0;
		border: 0;
		border-inline-start: var(--line);
		background-color: var(--color-background);
		color: var(--color-text);
	}

	.add-panel::backdrop {
		background-color: color-mix(in oklab, var(--color-background) 70%, transparent);
	}

	.add-panel-inner {
		box-sizing: border-box;
		min-block-size: 100%;
		padding: var(--space-l) var(--space-l) 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.add-panel[open] {
			transition: translate var(--duration-normal) var(--easing-standard);

			@starting-style {
				translate: 100% 0;
			}
		}
	}
</style>

<script>
	/**
	 * A native dialog that slides in from the right, with focus in its first
	 * field. Escape, the close button inside and the backdrop close it.
	 * @type {{ label: string, onclose: () => void, children: import('svelte').Snippet }}
	 */
	const { label, onclose, children } = $props()

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state()

	$effect(() => {
		if (!dialog || dialog.open) return
		dialog.showModal()
		// Start in the first field rather than on the close button
		const field = /** @type {HTMLElement | null} */ (
			dialog.querySelector('input:not([type="hidden"]), select, textarea')
		)
		field?.focus()
	})

	const close = (/** @type {Event} */ event) => {
		event.preventDefault()
		onclose()
	}
</script>

<dialog
	bind:this={dialog}
	class="side-panel"
	aria-label={label}
	oncancel={close}
	onclick={(event) => {
		if (event.target === dialog) close(event)
	}}
>
	<div class="side-panel-inner">{@render children()}</div>
</dialog>

<style>
	.side-panel {
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

	.side-panel::backdrop {
		background-color: color-mix(in oklab, var(--color-background) 70%, transparent);
	}

	.side-panel-inner {
		box-sizing: border-box;
		min-block-size: 100%;
		padding: var(--space-l) var(--space-l) 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.side-panel[open] {
			transition: translate var(--duration-normal) var(--easing-standard);

			@starting-style {
				translate: 100% 0;
			}
		}
	}
</style>

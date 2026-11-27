<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/**
	 * The assistant with a speech bubble. The bubble is outlined, the
	 * assistant is the only filled shape.
	 * @type {{ size?: string, big?: boolean, face?: boolean, children: import('svelte').Snippet }}
	 */
	const { size = '3.25rem', big = false, face = true, children } = $props()
</script>

<div class="mascot-says" class:big>
	<span class="mascot-says-face" aria-hidden="true" class:is-hidden={!face}>
		<Mascot {size} animate={false} />
	</span>
	<div class="mascot-says-bubble">{@render children()}</div>
</div>

<style>
	.mascot-says {
		display: flex;
		align-items: flex-end;
		gap: var(--space-s);
	}

	.mascot-says-face {
		display: flex;
		flex: none;
	}

	.mascot-says-face.is-hidden {
		visibility: hidden;
	}

	.mascot-says-bubble {
		max-inline-size: 40rem;
		padding: var(--space-s) var(--space-m);
		border: var(--line);
		border-radius: 1.375rem 1.375rem 1.375rem 0.375rem;
		font-size: var(--font-size-small);
		font-weight: 600;
		line-height: 1.5;
	}

	.big .mascot-says-bubble {
		font-size: 1.125rem;
	}

	.mascot-says-bubble :global(p + p) {
		margin-block-start: var(--space-xs);
	}
</style>

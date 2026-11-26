<script>
	/** @type {{ mode?: 'erase' | 'draw', contained?: boolean }} */
	const { mode = 'erase', contained = false } = $props()
</script>

<svg
	class="eraser-wipe eraser-{mode}"
	class:eraser-contained={contained}
	viewBox="0 0 100 100"
	preserveAspectRatio="none"
	aria-hidden="true"
>
	<path
		pathLength="1"
		d="M-10 3L110 9L-10 17L110 25L-10 33L110 41L-10 49L110 57L-10 65L110 73L-10 81L110 89L-10 97L110 105"
	/>
</svg>

<style>
	.eraser-wipe {
		position: fixed;
		inset: 0;
		z-index: var(--layer-eraser);
		inline-size: 100%;
		block-size: 100%;
		max-inline-size: none;
		pointer-events: none;
		filter: var(--rough-edge-strong);
	}

	.eraser-contained {
		position: absolute;
		inset: -1.5rem;
		inline-size: calc(100% + 3rem);
		block-size: calc(100% + 3rem);
	}

	path {
		fill: none;
		stroke: var(--color-background);
		stroke-width: 17;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		animation: var(--eraser-duration, var(--duration-eraser)) ease-in-out forwards;
	}

	.eraser-erase path {
		stroke-dashoffset: 1;
		animation-name: erase;
	}

	.eraser-draw path {
		stroke-dashoffset: 0;
		animation-name: draw;
	}

	@keyframes erase {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes draw {
		to {
			stroke-dashoffset: -1;
		}
	}
</style>

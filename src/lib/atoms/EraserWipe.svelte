<svg class="eraser-wipe" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
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

	path {
		fill: none;
		stroke: var(--color-background);
		stroke-width: 17;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: erase var(--duration-eraser) ease-in-out forwards;
	}

	@keyframes erase {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>

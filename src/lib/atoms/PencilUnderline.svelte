<svg class="pencil-underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
	<path pathLength="1" d="M3 7C40 4 80 9 120 6C150 4 178 8 197 5" />
	<path
		class="pencil-underline-second"
		pathLength="1"
		d="M10 9C55 7 100 10 145 8C165 7 182 9 194 8"
	/>
</svg>

<style>
	.pencil-underline {
		position: absolute;
		inset-inline: 1.25em;
		inset-block-end: 0.3em;
		z-index: 1;
		inline-size: calc(100% - 2.5em);
		block-size: 0.6em;
		max-inline-size: none;
		overflow: visible;
		pointer-events: none;
		filter: var(--rough-edge);
	}

	path {
		fill: none;
		stroke: var(--color-pencil);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		vector-effect: non-scaling-stroke;
		transition: stroke-dashoffset var(--duration-pencil) ease-out;
	}

	.pencil-underline-second {
		stroke-width: 1.5;
		opacity: 0.8;
		transition-delay: calc(var(--duration-pencil) * 0.35);
	}

	:global(.has-pencil:hover) > .pencil-underline path,
	:global(.has-pencil:focus-visible) > .pencil-underline path {
		stroke-dashoffset: 0;
	}
</style>

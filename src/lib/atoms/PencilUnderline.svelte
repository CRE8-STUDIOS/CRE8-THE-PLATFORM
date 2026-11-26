<svg class="pencil-underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
	<path
		pathLength="1"
		d="M4 5C45 3 90 7 130 5C160 4 182 6 196 5C198 6 197 8 192 8C150 9 100 7 60 9C40 10 22 9 12 10"
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
		transition: stroke-dashoffset var(--duration-pencil) ease-in-out;
	}

	:global(.has-pencil:hover) > .pencil-underline path,
	:global(.has-pencil:focus-visible) > .pencil-underline path {
		stroke-dashoffset: 0;
	}
</style>

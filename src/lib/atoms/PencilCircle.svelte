<svg class="pencil-circle" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
	<path
		pathLength="1"
		d="M30 14C70 2 160 4 188 22C202 33 196 58 160 70C120 80 50 77 18 64C4 56 6 30 34 16C60 6 110 4 142 9"
	/>
	<path
		class="pencil-circle-second"
		pathLength="1"
		d="M44 10C90 0 170 8 192 28C204 44 186 64 150 73C104 82 40 74 12 58C0 46 14 24 46 13C80 4 130 5 160 12"
	/>
</svg>

<style>
	.pencil-circle {
		position: absolute;
		inset-block: -0.55em;
		inset-inline: -1.1em;
		z-index: 1;
		inline-size: calc(100% + 2.2em);
		block-size: calc(100% + 1.1em);
		overflow: visible;
		pointer-events: none;
		filter: var(--rough-edge);
	}

	path {
		fill: none;
		stroke: var(--color-pencil);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		vector-effect: non-scaling-stroke;
		transition: stroke-dashoffset var(--duration-pencil) ease-out;
	}

	.pencil-circle-second {
		stroke-width: 1.25;
		opacity: 0.7;
		transition-delay: calc(var(--duration-pencil) * 0.35);
	}

	:global(.has-pencil:hover) > .pencil-circle path,
	:global(.has-pencil:focus-visible) > .pencil-circle path {
		stroke-dashoffset: 0;
	}
</style>

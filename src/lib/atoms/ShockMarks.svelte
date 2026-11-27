<svg class="shock-marks" viewBox="0 0 200 200" aria-hidden="true">
	<path
		class="shock-burst"
		pathLength="1"
		d="M28 186L9 209M-2 159L-20 169M-10 119L-40 125M-16 80L-36 76M3 44L-23 29M24 10L11 -6M62 -5L51 -33M100 -18L100 -38M138 -5L149 -33M176 10L189 -6M197 44L223 29M216 80L236 76M210 119L240 125M202 159L220 169M172 186L191 209"
	/>
	<text class="shock-bang" x="166" y="30">!</text>
	<text class="shock-bang shock-bang-small" x="12" y="44">!?</text>
	<path class="shock-drop" d="M38 70C34 78 31 84 36 88C41 91 46 86 44 80C43 76 40 73 38 70Z" />
	<path
		class="shock-drop shock-drop-late"
		d="M162 76C158 84 155 90 160 94C165 97 170 92 168 86C167 82 164 79 162 76Z"
	/>
</svg>

<style>
	.shock-marks {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		max-inline-size: none;
		overflow: visible;
		pointer-events: none;
	}

	.shock-burst {
		fill: none;
		stroke: var(--color-text);
		stroke-width: 5;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transform-origin: 100px 100px;
		filter: var(--rough-edge-strong);
		animation:
			shock-draw calc(var(--duration-auth-look) * 0.6) ease-out forwards,
			shock-pulse calc(var(--duration-auth-look) / 2) ease-in-out
				calc(var(--duration-auth-look) * 0.6) infinite alternate;
	}

	.shock-bang {
		fill: var(--color-text);
		font-family: var(--font-family-display);
		font-size: 56px;
		font-weight: var(--font-weight-heading);
		transform-box: fill-box;
		transform-origin: center bottom;
		filter: var(--rough-edge);
		animation:
			shock-pop calc(var(--duration-auth-look) * 0.5) cubic-bezier(0.3, 1.8, 0.5, 1) both,
			shock-wobble calc(var(--duration-auth-look) / 1.5) ease-in-out infinite alternate;
	}

	.shock-bang-small {
		font-size: 38px;
		animation-delay: calc(var(--duration-auth-look) * 0.2), 0s;
		animation-direction: normal, alternate-reverse;
	}

	.shock-drop {
		fill: var(--color-surface);
		stroke: var(--color-text);
		stroke-width: 3;
		filter: var(--rough-edge);
		animation: shock-drip calc(var(--duration-auth-look) * 1.6) ease-in infinite;
	}

	.shock-drop-late {
		animation-delay: calc(var(--duration-auth-look) * 0.8);
	}

	@keyframes shock-draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes shock-pulse {
		from {
			scale: 0.95;
		}
		to {
			scale: 1.08;
		}
	}

	@keyframes shock-pop {
		from {
			scale: 0;
		}
		to {
			scale: 1;
		}
	}

	@keyframes shock-wobble {
		from {
			rotate: -14deg;
		}
		to {
			rotate: 14deg;
		}
	}

	@keyframes shock-drip {
		0% {
			opacity: 0;
			translate: 0 -6px;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			translate: 0 26px;
		}
	}
</style>

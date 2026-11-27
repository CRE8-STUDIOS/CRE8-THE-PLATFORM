<svg class="shock-marks" viewBox="0 0 200 200" aria-hidden="true">
	<path
		class="shock-lines"
		d="M47 192L37 209M10 163L0 170M-4 118L-24 122M-6 72L-18 68M19 32L3 19M54 0L48 -11M100 -6L100 -26M146 0L152 -11M181 32L197 19M206 72L218 68M204 118L224 122M190 163L200 170M153 192L163 209"
	/>
	<text class="shock-bang" x="168" y="34">!</text>
	<text class="shock-bang shock-bang-small" x="22" y="52">!</text>
	<path class="shock-shine" d="M74 150C66 141 66 130 70 122" />
	<circle class="shock-shine-dot" cx="80" cy="161" r="3" />
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

	.shock-lines {
		fill: none;
		stroke: var(--color-text);
		stroke-width: 3.5;
		stroke-linecap: round;
		transform-origin: 100px 100px;
		filter: var(--rough-edge);
		animation: shock-pop calc(var(--duration-auth-look) / 2) ease-in-out infinite alternate;
	}

	.shock-bang {
		fill: var(--color-text);
		font-family: var(--font-family-display);
		font-size: 38px;
		font-weight: var(--font-weight-heading);
		transform-box: fill-box;
		transform-origin: center bottom;
		animation: shock-wobble calc(var(--duration-auth-look) / 1.5) ease-in-out infinite alternate;
	}

	.shock-bang-small {
		font-size: 26px;
		animation-direction: alternate-reverse;
	}

	.shock-shine {
		fill: none;
		stroke: var(--color-surface);
		stroke-width: 5;
		stroke-linecap: round;
	}

	.shock-shine-dot {
		fill: var(--color-surface);
	}

	@keyframes shock-pop {
		from {
			scale: 0.94;
		}
		to {
			scale: 1.06;
		}
	}

	@keyframes shock-wobble {
		from {
			rotate: -12deg;
		}
		to {
			rotate: 12deg;
		}
	}
</style>

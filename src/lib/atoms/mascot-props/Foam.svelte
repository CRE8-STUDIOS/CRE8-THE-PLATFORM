<svelte:options namespace="svg" />

<script>
	/** @type {{ scrub?: boolean, bubbles?: boolean, visible?: boolean }} */
	const { scrub = false, bubbles = false, visible = true } = $props()
</script>

<g class="foam-layer" opacity={visible ? 1 : 0}>
	<g class:scrub>
		<circle class="suds" cx="72" cy="52" r="15" />
		<circle class="suds" cx="96" cy="38" r="19" />
		<circle class="suds" cx="124" cy="46" r="16" />
		<circle class="suds" cx="140" cy="62" r="11" />
		<circle class="fill" cx="110" cy="58" r="12" />
		<circle class="fill" cx="84" cy="60" r="10" />
	</g>
	{#if bubbles}
		<circle class="bubble" cx="70" cy="20" r="6" />
		<circle class="bubble b2" cx="120" cy="10" r="4" />
		<circle class="bubble b3" cx="146" cy="30" r="5" />
	{/if}
</g>

<style>
	.foam-layer {
		transition: opacity var(--duration-normal) var(--easing-standard);
	}

	.suds,
	.fill {
		fill: var(--mascot-eye);
	}

	.suds {
		stroke: var(--color-text);
		stroke-width: 3;
	}

	.bubble {
		fill: none;
		stroke: var(--color-text);
		stroke-width: 2;
	}

	@media (prefers-reduced-motion: no-preference) {
		.scrub {
			transform-origin: 100px 50px;
			transform-box: view-box;
			animation: scrub 0.3s ease-in-out infinite;
		}

		.bubble {
			animation: rise 1.6s ease-out infinite;
		}

		.b2 {
			animation-delay: 0.5s;
		}

		.b3 {
			animation-delay: 1s;
		}
	}

	@keyframes scrub {
		0%,
		100% {
			transform: rotate(-3deg);
		}
		50% {
			transform: rotate(3deg) scale(1.02, 0.98);
		}
	}

	@keyframes rise {
		0% {
			transform: translateY(0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: translateY(-40px);
			opacity: 0;
		}
	}
</style>

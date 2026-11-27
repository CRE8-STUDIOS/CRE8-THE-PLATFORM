<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/**
	 * The mascot with props layered behind and in front of it. Every layer uses
	 * the same 200 by 200 viewBox as the mascot.
	 * @type {{
	 *   size: string,
	 *   shape?: string,
	 *   label?: string,
	 *   face?: boolean,
	 *   eyes?: string,
	 *   motion?: 'bob' | 'still' | 'scrub' | 'jump' | 'spin' | 'pop',
	 *   back?: import('svelte').Snippet,
	 *   front?: import('svelte').Snippet,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	const { size, shape, label, face = true, eyes, motion = 'bob', back, front, children } = $props()
</script>

<div class="mascot-stage {motion}" style:--stage-size={size}>
	{#if back}
		<svg class="mascot-layer behind" viewBox="0 0 200 200" aria-hidden="true">
			{@render back()}
		</svg>
	{/if}
	<Mascot size="100%" {shape} {label} {face} {eyes} animate={motion !== 'still'} bob={false} />
	{#if front}
		<svg class="mascot-layer" viewBox="0 0 200 200" aria-hidden="true">
			{@render front()}
		</svg>
	{/if}
	{@render children?.()}
</div>

<style>
	.mascot-stage {
		position: relative;
		isolation: isolate;
		inline-size: var(--stage-size);
		block-size: var(--stage-size);
		transform-origin: 50% 90%;
	}

	.mascot-layer {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.behind {
		z-index: -1;
	}

	/* The whole stage moves, so costumes and props stay on the body */
	@media (prefers-reduced-motion: no-preference) {
		.bob {
			animation: bob var(--mascot-bob-speed) ease-in-out infinite;
		}

		.scrub {
			animation: scrub 0.45s ease-in-out infinite;
		}

		.jump {
			animation:
				jump 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) both,
				shake 0.08s linear 0.5s 8;
		}

		.spin {
			animation: spin 0.8s ease-in-out both;
		}

		.pop {
			animation: pop 0.7s cubic-bezier(0.3, 1.6, 0.5, 1) both;
		}
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0) scale(1, 1);
		}
		45% {
			transform: translateY(calc(-1 * var(--mascot-bob-height))) scale(0.97, 1.03);
		}
		80% {
			transform: translateY(0) scale(1.04, 0.95);
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

	@keyframes jump {
		0% {
			transform: translateY(0) scale(1);
		}
		60% {
			transform: translateY(-40px) scale(0.9, 1.12);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0) scale(1);
		}
		50% {
			transform: rotate(200deg) scale(0.6);
		}
		100% {
			transform: rotate(360deg) scale(1);
		}
	}

	@keyframes pop {
		0% {
			transform: scale(0) rotate(-20deg);
		}
		100% {
			transform: scale(1) rotate(0);
		}
	}
</style>

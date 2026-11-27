<script>
	import { page } from '$app/state'
	import { mascotShapes } from '#lib/utils/mascot-shapes.js'
	import { ASSISTANT_DEFAULT_NAME } from '#lib/utils/constants.js'

	/** @type {{ size?: string, shape?: string, eyes?: string, face?: boolean, animate?: boolean, bob?: boolean, follow?: boolean, gaze?: { x: number, y: number } | null, label?: string }} */
	const {
		size,
		shape,
		eyes,
		face = true,
		animate = true,
		bob = true,
		follow = false,
		gaze = null,
		label
	} = $props()

	const assistant = $derived(page.data.assistant)
	const outline = $derived(
		mascotShapes[/** @type {keyof typeof mascotShapes} */ (shape ?? assistant?.shape)] ??
			mascotShapes.splat
	)
	const fallback = $derived(page.data.role === 'freelancer' ? ASSISTANT_DEFAULT_NAME : 'CRE8')
	const name = $derived(label ?? (assistant?.name || fallback))

	/** @type {SVGSVGElement | undefined} */
	let svg = $state()
	let look = $state({ x: 0, y: 0 })
	let reachLimit = $state(0)

	$effect(() => {
		if (svg)
			reachLimit = parseFloat(getComputedStyle(svg).getPropertyValue('--mascot-look-distance')) || 0
	})

	const offset = $derived(gaze ? { x: gaze.x * reachLimit, y: gaze.y * reachLimit } : look)

	$effect(() => {
		if (!follow || !svg || matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const element = svg
		const distance = parseFloat(
			getComputedStyle(element).getPropertyValue('--mascot-look-distance')
		)

		const onMove = (/** @type {PointerEvent} */ event) => {
			const box = element.getBoundingClientRect()
			const dx = event.clientX - (box.left + box.width / 2)
			const dy = event.clientY - (box.top + box.height * 0.53)
			const length = Math.hypot(dx, dy) || 1
			const reach = Math.min(1, length / box.width) * (distance || 0)
			look = { x: (dx / length) * reach, y: (dy / length) * reach }
		}

		window.addEventListener('pointermove', onMove)
		return () => window.removeEventListener('pointermove', onMove)
	})
</script>

<svg
	bind:this={svg}
	class="mascot"
	class:animate
	class:bob={animate && bob}
	viewBox="0 0 200 200"
	style:--mascot-size={size}
	role="img"
	aria-label={name}
>
	<path class="body" d={outline} />
	{#if face}
		<g class="look" style:transform={eyes ?? `translate(${offset.x}px, ${offset.y}px)`}>
			<g class="eyes">
				<ellipse cx="80" cy="106" rx="15" ry="22" />
				<ellipse cx="120" cy="106" rx="15" ry="22" />
			</g>
		</g>
	{/if}
</svg>

<style>
	.mascot {
		display: inline-block;
		inline-size: var(--mascot-size);
		block-size: var(--mascot-size);
		overflow: visible;
		transform-origin: 50% 90%;
	}

	.body {
		fill: var(--mascot-color);
	}

	.look {
		transition: transform var(--duration-fast) ease-out;
	}

	.eyes {
		fill: var(--mascot-eye);
		stroke: var(--mascot-color);
		stroke-width: var(--mascot-eye-border);
		transform-origin: 100px 106px;
		transform-box: view-box;
	}

	@media (prefers-reduced-motion: no-preference) {
		.bob {
			animation: bob var(--mascot-bob-speed) ease-in-out infinite;
		}

		.animate .eyes {
			animation: blink var(--mascot-blink-speed) infinite;
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

	@keyframes blink {
		0%,
		92%,
		100% {
			transform: scaleY(1);
		}
		95% {
			transform: scaleY(0.1);
		}
	}
</style>

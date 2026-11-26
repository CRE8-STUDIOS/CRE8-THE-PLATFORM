<script>
	/** @type {{ size?: string, face?: boolean, animate?: boolean, follow?: boolean, label?: string }} */
	const { size, face = true, animate = true, follow = false, label = 'CRE8' } = $props()

	/** @type {SVGSVGElement | undefined} */
	let svg = $state()
	let look = $state({ x: 0, y: 0 })

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
	viewBox="0 0 200 200"
	style:--mascot-size={size}
	role="img"
	aria-label={label}
>
	<path
		class="body"
		d="M68.8 19.7C66.4 20.4 64.3 24.4 63.6 27.3C62.9 30.1 64.1 33.5 64.6 36.7C65.1 39.8 65.8 42.8 66.5 45.9C67.2 49 68 52.1 68.6 55.2C69.2 58.3 70.1 61.4 70.2 64.5C70.4 67.6 71 72.3 69.5 73.6C67.9 74.9 63.8 73.4 61 72.4C58.3 71.4 55.6 69.1 52.9 67.5C50.2 65.9 47.4 64.4 44.7 62.8C42 61.2 39.5 59 36.6 57.8C33.8 56.6 29.9 54.8 27.6 55.5C25.2 56.3 22.5 59.7 22.6 62.1C22.6 64.4 25.6 67.6 27.7 69.9C29.8 72.2 32.6 73.9 35 75.9C37.4 78 39.9 80 42 82.3C44.2 84.6 48 87.6 47.9 89.6C47.9 91.6 44.3 93.4 41.7 94.2C39.1 95 35.4 94.3 32.2 94.2C29.1 94.1 25.9 93.7 22.8 93.7C19.6 93.8 15.2 93.2 13.4 94.6C11.6 96 10.7 100.3 11.9 102C13.2 103.8 17.8 104.3 20.8 105.1C23.9 105.9 27 106.3 30.2 106.8C33.3 107.2 36.6 107 39.6 107.8C42.5 108.7 47.3 110 47.9 111.7C48.5 113.4 45.4 116.3 43.2 117.9C40.9 119.4 37.2 120 34.3 121.2C31.4 122.4 28.4 123.6 25.6 125C22.7 126.3 19.1 127.2 17.1 129.2C15.1 131.2 12.7 135.3 13.6 136.9C14.5 138.5 19.4 138.7 22.4 138.6C25.4 138.5 28.5 137.1 31.6 136.3C34.7 135.5 37.7 134.6 40.8 134C43.9 133.3 47.1 132.3 50.1 132.6C53.2 132.8 56.8 133.7 58.9 135.5C61 137.4 62.4 140.9 62.9 143.9C63.4 146.8 62.5 150.2 61.8 153.2C61 156.3 59.4 159 58.1 161.9C56.9 164.8 54.6 167.6 54.3 170.5C54 173.3 54.5 178 56.2 178.8C57.9 179.6 62.1 177 64.6 175.3C67.2 173.6 69.2 171 71.5 168.8C73.9 166.7 76 164.3 78.6 162.5C81.1 160.6 83.9 158.2 86.7 157.7C89.5 157.3 93 158.3 95.5 159.8C98 161.4 99 165.9 101.5 167.1C104 168.3 108 168.4 110.4 167.1C112.7 165.8 113.4 161.2 115.7 159.3C117.9 157.5 121 155.6 123.7 155.8C126.5 156 129.3 158.8 131.9 160.5C134.5 162.2 137.1 164.1 139.6 166C142.1 168 144.5 170.1 146.9 172.1C149.3 174.1 151.5 177.2 154.1 178.2C156.7 179.2 161.3 179.7 162.5 178.2C163.7 176.7 162.1 172 161 169.2C160 166.3 157.7 163.8 156 161.2C154.2 158.5 152.1 156.1 150.4 153.5C148.8 150.8 147.3 147.9 146.1 145.1C144.8 142.2 143.3 139.2 143 136.1C142.7 133.1 143.1 129.7 144.1 126.8C145 123.9 146.5 120.7 148.6 118.6C150.7 116.5 154 115.4 156.9 114.2C159.8 113.1 163 112.5 166.1 111.8C169.1 111 172.3 110.6 175.3 109.6C178.2 108.5 181.4 107.3 183.7 105.4C186.1 103.5 189.5 100.3 189.3 98.1C189.1 95.9 185.3 93.4 182.7 92.2C180 90.9 176.5 90.9 173.3 90.7C170.2 90.6 167 91.1 163.9 91.4C160.8 91.7 157.6 92.5 154.5 92.7C151.4 92.9 148 93.4 145.1 92.5C142.3 91.6 139 89.7 137.4 87.3C135.8 84.9 135.5 81.4 135.6 78.4C135.7 75.3 136.8 72.1 138 69.2C139.2 66.3 141.2 63.8 142.8 61.1C144.4 58.3 146.5 55.8 147.6 52.9C148.7 50 150.2 46.4 149.5 43.8C148.9 41.2 146 37.5 143.7 37.1C141.3 36.7 137.9 39.4 135.6 41.4C133.3 43.4 131.8 46.5 130 49C128.1 51.6 126.5 54.3 124.4 56.7C122.4 59.2 120.5 61.9 117.9 63.6C115.4 65.2 112.1 66.5 109.1 66.6C106.2 66.6 102.7 65.5 100.2 63.9C97.6 62.3 95.7 59.4 93.9 56.9C92.2 54.3 90.9 51.3 89.7 48.4C88.4 45.5 87.6 42.4 86.4 39.5C85.3 36.5 84.1 33.6 82.7 30.8C81.2 28 79.9 24.7 77.6 22.8C75.3 21 71.1 18.9 68.8 19.7Z"
	/>
	{#if face}
		<g class="look" style:transform="translate({look.x}px, {look.y}px)">
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
		transform-origin: 100px 106px;
		transform-box: view-box;
	}

	@media (prefers-reduced-motion: no-preference) {
		.animate {
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

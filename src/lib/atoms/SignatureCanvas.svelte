<script>
	/** @type {{ paths?: string[], width?: number, height?: number }} */
	let { paths = $bindable([]), width = 400, height = 150 } = $props()

	let current = $state('')
	let drawing = false

	const point = (/** @type {PointerEvent} */ event) => {
		const box = /** @type {Element} */ (event.currentTarget).getBoundingClientRect()
		const x = Math.round(((event.clientX - box.left) / box.width) * width)
		const y = Math.round(((event.clientY - box.top) / box.height) * height)
		return `${x} ${y}`
	}

	const start = (/** @type {PointerEvent} */ event) => {
		const target = /** @type {Element} */ (event.currentTarget)
		drawing = true
		target.setPointerCapture(event.pointerId)
		current = `M ${point(event)}`
	}

	const move = (/** @type {PointerEvent} */ event) => {
		if (drawing) current += ` L ${point(event)}`
	}

	const stop = () => {
		if (!drawing) return
		drawing = false
		if (current) paths = [...paths, current]
		current = ''
	}
</script>

<svg
	class="signature-canvas"
	viewBox="0 0 {width} {height}"
	{width}
	{height}
	role="img"
	aria-label="Signature area: draw your signature here"
	onpointerdown={start}
	onpointermove={move}
	onpointerup={stop}
	onpointerleave={stop}
>
	<path
		d={[...paths, current].join(' ')}
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

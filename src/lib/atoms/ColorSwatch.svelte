<script>
	/** @type {{ color: string | null }} */
	const { color } = $props()
</script>

<span class="color-swatch" style:--_swatch-color={color} aria-hidden="true"></span>

<style>
	.color-swatch {
		display: inline-block;
		inline-size: 1em;
		block-size: 1em;
		background-color: var(--_swatch-color, transparent);
	}
</style>

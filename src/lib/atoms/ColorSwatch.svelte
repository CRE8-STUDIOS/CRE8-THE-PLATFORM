<script>
	/** @type {{ color: string | null, size?: 'small' | 'large' }} */
	const { color, size = 'small' } = $props()
</script>

<span class="color-swatch color-swatch-{size}" style:--_swatch-color={color} aria-hidden="true"
></span>

<style>
	.color-swatch {
		display: inline-block;
		background-color: var(--_swatch-color, transparent);
	}

	.color-swatch-small {
		inline-size: 1em;
		block-size: 1em;
	}

	.color-swatch-large {
		inline-size: 100%;
		aspect-ratio: 1;
		border-radius: var(--radius-small);
	}
</style>

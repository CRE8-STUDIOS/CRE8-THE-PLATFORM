<svelte:options namespace="svg" />

<script>
	const BLUE = 'var(--mascot-blue)'
	const GREEN = 'var(--mascot-green)'
	const WHITE = '#ffffff'
	const YELLOW = '#f5c542'

	/** @type {[number, number, string, number][]} x, y, colour, angle */
	const SPRINKLES = [
		[78, 123, BLUE, 94],
		[125, 108, WHITE, 155],
		[49, 108, YELLOW, 141],
		[77, 72, GREEN, 138],
		[118, 108, GREEN, 163],
		[67, 77, BLUE, 133],
		[97, 142, WHITE, 171],
		[56, 68, WHITE, 77],
		[51, 82, GREEN, 152],
		[140, 97, GREEN, 101],
		[141, 150, GREEN, 34],
		[94, 60, WHITE, 34],
		[111, 75, YELLOW, 172],
		[103, 147, YELLOW, 107],
		[112, 97, YELLOW, 136],
		[122, 100, BLUE, 86]
	]
</script>

{#each SPRINKLES as [x, y, fill, angle], index (index)}
	<rect {x} {y} width="12" height="4" rx="2" {fill} transform="rotate({angle} {x + 6} {y + 2})" />
{/each}

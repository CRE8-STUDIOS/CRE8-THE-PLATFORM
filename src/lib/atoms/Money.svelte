<script>
	import { euro } from '#lib/utils/format.js'

	/** @type {{ value: number | null | undefined }} */
	const { value } = $props()
</script>

<data class="money" value={value ?? 0}>{euro(value)}</data>

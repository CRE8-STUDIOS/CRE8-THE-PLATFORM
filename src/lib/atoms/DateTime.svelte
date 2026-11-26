<script>
	import { formatDateTime, formatTime } from '#lib/utils/dates.js'

	/** @type {{ value: string | null | undefined, timeZone?: string, show?: 'date-time' | 'time' }} */
	const { value, timeZone, show = 'date-time' } = $props()
	const label = $derived(
		show === 'time' ? formatTime(value, timeZone) : formatDateTime(value, timeZone)
	)
</script>

{#if value}
	<time datetime={value}>{label}</time>
{/if}

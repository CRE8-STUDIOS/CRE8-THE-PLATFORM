<script>
	import CalmField from '#lib/molecules/CalmField.svelte'

	/**
	 * @type {{ from?: string, to?: string, fromLabel?: string, toLabel?: string, fromName?: string, toName?: string, errors?: Record<string, string> }}
	 */
	const {
		from = '',
		to = '',
		fromLabel = 'From',
		toLabel = 'To',
		fromName = 'from',
		toName = 'to',
		errors = {}
	} = $props()
</script>

<div class="time-range">
	<CalmField label={fromLabel} name={fromName} type="time" value={from} error={errors[fromName]} />
	<CalmField label={toLabel} name={toName} type="time" value={to} error={errors[toName]} />
</div>

<style>
	.time-range {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-s);
		max-inline-size: 22rem;
	}
</style>

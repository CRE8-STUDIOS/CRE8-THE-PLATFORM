<script>
	/** @type {{ label: string, value: string, note?: string }} */
	const { label, value, note } = $props()
</script>

<section class="stat-card card rough-edge" aria-label={label}>
	<p class="label text-muted">{label}</p>
	<p class="stat-number">{value}</p>
	{#if note}<p class="text-small text-muted">{note}</p>{/if}
</section>

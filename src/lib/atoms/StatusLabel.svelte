<script>
	/** @type {{ status: string }} */
	const { status } = $props()
</script>

<span class="status-label status-label-{status}">{status.replaceAll('_', ' ')}</span>

<script>
	/**
	 * A status word, e.g. draft, active, sent, paid, overdue.
	 * @type {{ status: string }}
	 */
	const { status } = $props()
</script>

<span class="status-label status-label-{status}">{status.replaceAll('_', ' ')}</span>

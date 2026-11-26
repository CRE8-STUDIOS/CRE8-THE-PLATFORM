<script>
	/** @type {{ status: string }} */
	const { status } = $props()

	/** @type {Record<string, string>} */
	const tones = {
		active: 'progress',
		in_progress: 'progress',
		editing: 'editing',
		pending: 'pending',
		draft: 'draft',
		open: 'draft',
		sent: 'draft',
		requested: 'draft',
		'waiting for a price': 'draft',
		paid: 'paid',
		signed: 'paid',
		approved: 'paid',
		done: 'paid',
		overdue: 'overdue',
		declined: 'overdue',
		archived: 'neutral'
	}
	const tone = $derived(tones[status] ?? 'neutral')
</script>

<span class="status-label status-tag status-tag-{tone}">{status.replaceAll('_', ' ')}</span>

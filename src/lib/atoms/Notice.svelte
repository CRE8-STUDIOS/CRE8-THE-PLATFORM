<script>
	/**
	 * A short message: an error (announced right away to screen readers) or a confirmation.
	 * @type {{ type?: 'error' | 'success' | 'info', children: import('svelte').Snippet }}
	 */
	const { type = 'info', children } = $props()
	const role = $derived(type === 'error' ? 'alert' : 'status')
</script>

<p class="notice notice-{type}" {role}>{@render children()}</p>

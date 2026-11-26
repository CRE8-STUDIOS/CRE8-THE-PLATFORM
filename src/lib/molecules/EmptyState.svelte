<script>
	/** @type {{ title: string, text?: string, children?: import('svelte').Snippet }} */
	const { title, text, children } = $props()
</script>

<div class="empty-state">
	<p class="card-title">{title}</p>
	{#if text}<p>{text}</p>{/if}
	{#if children}{@render children()}{/if}
</div>

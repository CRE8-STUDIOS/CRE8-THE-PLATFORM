<script>
	/** @type {{ type?: 'submit' | 'button' | 'reset', variant?: 'primary' | 'secondary' | 'muted' | 'danger', children: import('svelte').Snippet } & import('svelte/elements').HTMLButtonAttributes} */
	const { type = 'submit', variant = 'secondary', children, ...rest } = $props()
</script>

<button {type} class="button button-{variant}" {...rest}>{@render children()}</button>

<script>
	/**
	 * A button. Defaults to type="submit" so it sends the form it is in.
	 * @type {{ type?: 'submit' | 'button' | 'reset', variant?: 'primary' | 'secondary' | 'danger', children: import('svelte').Snippet } & import('svelte/elements').HTMLButtonAttributes}
	 */
	const { type = 'submit', variant = 'secondary', children, ...rest } = $props()
</script>

<button {type} class="button button-{variant}" {...rest}>{@render children()}</button>

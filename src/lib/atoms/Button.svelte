<script>
	/** @type {{ type?: 'submit' | 'button' | 'reset', variant?: 'primary' | 'secondary' | 'muted' | 'text' | 'danger', children: import('svelte').Snippet } & import('svelte/elements').HTMLButtonAttributes} */
	const { type = 'submit', variant = 'secondary', class: extra, children, ...rest } = $props()
</script>

<button {type} class={['button', `button-${variant}`, extra]} {...rest}>
	{@render children()}
</button>

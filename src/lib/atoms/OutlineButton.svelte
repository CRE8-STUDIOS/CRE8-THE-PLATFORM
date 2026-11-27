<script>
	/**
	 * A calm button: a line, no fill. A link when it has an href.
	 * @type {{
	 *   href?: string,
	 *   strong?: boolean,
	 *   round?: boolean,
	 *   type?: 'button' | 'submit' | 'reset',
	 *   class?: string,
	 *   children: import('svelte').Snippet
	 * } & Record<string, unknown>}
	 */
	const {
		href,
		strong = false,
		round = false,
		type = 'submit',
		class: extra,
		children,
		...rest
	} = $props()
</script>

{#if href}
	<a {href} class={['outline-button', { strong, round }, extra]} {...rest}>{@render children()}</a>
{:else}
	<button {type} class={['outline-button', { strong, round }, extra]} {...rest}>
		{@render children()}
	</button>
{/if}

<style>
	.outline-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		min-block-size: var(--size-touch);
		padding-inline: 1.125rem;
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--color-text);
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-display);
		text-decoration: none;
		text-transform: uppercase;
		white-space: nowrap;
		cursor: pointer;
	}

	.strong {
		border: var(--line-strong);
	}

	.round {
		inline-size: var(--size-touch);
		padding: 0;
	}

	.outline-button:hover {
		text-decoration: underline;
	}
</style>

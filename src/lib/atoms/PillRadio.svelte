<script>
	/**
	 * A radio styled as an outlined pill. The chosen one gets the strong line.
	 * @type {{ name: string, value: string, checked?: boolean, children: import('svelte').Snippet }}
	 */
	const { name, value, checked = false, children } = $props()
</script>

<label class="pill">
	<input class="visually-hidden" type="radio" {name} {value} {checked} />
	<span>{@render children()}</span>
</label>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		padding-inline: var(--space-s);
		border: var(--line-quiet);
		border-radius: var(--radius-pill);
		color: var(--color-text-calm);
		font-size: var(--font-size-label);
		font-weight: 700;
		text-transform: uppercase;
		white-space: nowrap;
		cursor: pointer;
	}

	.pill:has(input:checked) {
		border: var(--line-strong);
		color: var(--color-text);
	}

	.pill:has(input:focus-visible) {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}
</style>

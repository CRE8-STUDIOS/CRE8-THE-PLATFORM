<script>
	/** @type {{ label: string, id: string } & import('svelte/elements').HTMLInputAttributes} */
	const { label, id, ...rest } = $props()
</script>

<div class="auth-field">
	<label class="field-label" for={id}>{label}</label>
	<span class="auth-input">
		<input {id} {...rest} />
	</span>
</div>

<style>
	.auth-field {
		display: grid;
		gap: var(--space-2xs);
		inline-size: 100%;
		text-align: start;
	}

	.auth-field .field-label {
		padding-inline-start: var(--space-s);
	}

	.auth-input {
		position: relative;
		isolation: isolate;
		display: block;
	}

	.auth-input::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: var(--radius-pill);
		background-color: var(--color-surface);
		filter: var(--rough-edge);
	}

	.auth-input input {
		border: none;
		border-radius: var(--radius-pill);
		background-color: transparent;
		color: var(--color-text);
	}
</style>

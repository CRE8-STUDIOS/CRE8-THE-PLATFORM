<script>
	/** @type {{ projects: { value: string, label: string }[], value?: string }} */
	const { projects, value = '' } = $props()
</script>

<div class="project-field">
	<label for="field-project">Project <span>optional</span></label>
	<select id="field-project" name="project_id">
		<option value="">No project</option>
		{#each projects as project (project.value)}
			<option value={project.value} selected={project.value === value}>{project.label}</option>
		{/each}
	</select>
</div>

<style>
	.project-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	label {
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	label span {
		color: var(--color-text-calm);
		font-weight: 500;
		text-transform: none;
	}

	select {
		min-block-size: var(--size-touch);
		padding-inline: var(--space-s);
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
	}
</style>

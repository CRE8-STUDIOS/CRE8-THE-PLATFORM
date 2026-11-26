<script>
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import { TIME_CATEGORIES, toOptions } from '#lib/utils/constants.js'

	/** @type {{ projects: { id: string, title: string, status: string }[], redirectTo?: string, secondary?: import('svelte').Snippet }} */
	const { projects, redirectTo = '/overview', secondary } = $props()

	const projectOptions = $derived(
		projects.map(({ id, title, status }) => ({
			value: id,
			label: status === 'draft' ? `${title} (draft)` : title
		}))
	)
</script>

<form class="clock-in-form" method="POST" action="/clock?/in">
	<Input type="hidden" name="redirectTo" value={redirectTo} />
	<Input type="hidden" name="started_by" value="manual" />
	<div class="clock-in-form-fields">
		<SelectField label="Project" name="project_id" options={projectOptions} empty="No project" />
		<SelectField
			label="What kind of work"
			name="category"
			options={toOptions(TIME_CATEGORIES)}
			value="client_work"
		/>
	</div>
	<div class="button-group clock-in-form-buttons">
		<Button variant="primary">Yes, clock in</Button>
		{#if secondary}{@render secondary()}{/if}
	</div>
</form>

<style>
	.clock-in-form {
		display: grid;
		gap: var(--space-m);
		inline-size: 100%;
		text-align: start;
	}

	.clock-in-form-fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--size-grid-m)), 1fr));
		gap: var(--space-s);
	}

	.clock-in-form-buttons {
		justify-content: center;
	}
</style>

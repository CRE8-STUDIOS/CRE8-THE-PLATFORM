<script>
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import { TIME_CATEGORIES, toOptions } from '#lib/utils/constants.js'

	/** @type {{ projects: { id: string, title: string, status: string }[], redirectTo?: string }} */
	const { projects, redirectTo = '/overview' } = $props()

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
	<SelectField label="Project" name="project_id" options={projectOptions} empty="No project" />
	<SelectField
		label="What kind of work"
		name="category"
		options={toOptions(TIME_CATEGORIES)}
		value="client_work"
	/>
	<Button variant="primary">Start working</Button>
</form>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'

	/**
	 * @type {{
	 *   title: string, action: string, submitLabel: string,
	 *   clients: { value: string, label: string }[],
	 *   clientId?: string | null,
	 *   project?: { title: string, client_id: string | null, price_type: string, price: number | null, start_date: string | null, deadline: string | null, color: string | null, briefing: string | null },
	 *   form: { message?: string, success?: string } | null | undefined
	 * }}
	 */
	const { title, action, submitLabel, clients, clientId, project, form } = $props()

	const priceTypes = [
		{ value: 'fixed', label: 'Fixed price' },
		{ value: 'hourly', label: 'Hourly' }
	]
</script>

<section class="project-form">
	<Heading>{title}</Heading>
	<FormNotice {form} />
	<form method="POST" {action}>
		<TextField label="Title" name="title" value={project?.title ?? ''} required />
		<SelectField
			label="Client"
			name="client_id"
			options={clients}
			value={project?.client_id ?? clientId}
			empty="No client yet"
			hint="New client? Add them under Clients first."
		/>
		<SelectField
			label="Price type"
			name="price_type"
			options={priceTypes}
			value={project?.price_type ?? 'fixed'}
		/>
		<TextField
			label="Price or hourly rate (€)"
			name="price"
			inputmode="decimal"
			value={project?.price ?? ''}
		/>
		<TextField label="Start date" name="start_date" type="date" value={project?.start_date ?? ''} />
		<TextField label="Deadline" name="deadline" type="date" value={project?.deadline ?? ''} />
		<TextField label="Colour" name="color" type="color" value={project?.color ?? '#888888'} />
		<TextareaField label="Briefing" name="briefing" rows={6} value={project?.briefing ?? ''} />
		<Button variant="primary">{submitLabel}</Button>
	</form>
</section>

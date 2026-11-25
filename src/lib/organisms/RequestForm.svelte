<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'

	/** @type {{ title: string, action: string, submitLabel: string, request?: { id: string, title: string, description: string | null, price: number | null, estimated_hours: number | null, planned_start: string | null } }} */
	const { title, action, submitLabel, request } = $props()
</script>

<section class="request-form">
	<Heading level={request ? 3 : 2}>{title}</Heading>
	<form method="POST" {action}>
		{#if request}<Input type="hidden" name="id" value={request.id} />{/if}
		<TextField label="Title" name="title" value={request?.title ?? ''} required />
		<TextareaField
			label="Description"
			name="description"
			rows={3}
			value={request?.description ?? ''}
		/>
		<TextField label="Price (€)" name="price" inputmode="decimal" value={request?.price ?? ''} />
		<TextField
			label="Estimated hours"
			name="estimated_hours"
			inputmode="decimal"
			value={request?.estimated_hours ?? ''}
		/>
		<TextField
			label="Planned start"
			name="planned_start"
			type="date"
			value={request?.planned_start ?? ''}
		/>
		<Button variant="primary">{submitLabel}</Button>
	</form>
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'

	/** @type {{ title: string, action: string, submitLabel: string, template?: { id: string, name: string, body: string } }} */
	const { title, action, submitLabel, template } = $props()
</script>

<section class="template-form">
	<Heading level={template ? 3 : 2}>{title}</Heading>
	<form method="POST" {action}>
		{#if template}<Input type="hidden" name="id" value={template.id} />{/if}
		<TextField label="Name" name="name" value={template?.name ?? ''} required />
		<TextareaField label="Text" name="body" rows={8} value={template?.body ?? ''} />
		<Button variant="primary">{submitLabel}</Button>
	</form>
</section>

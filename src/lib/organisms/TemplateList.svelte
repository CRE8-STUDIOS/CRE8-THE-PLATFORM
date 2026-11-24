<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import TemplateForm from '#lib/organisms/TemplateForm.svelte'

	/** @type {{ templates: { id: string, name: string, body: string }[] }} */
	const { templates } = $props()
</script>

<section class="template-list">
	<Heading>Contract templates</Heading>
	{#each templates as template (template.id)}
		<article class="template-list-item">
			<TemplateForm title={template.name} action="?/update" submitLabel="Save" {template} />
			<ActionButton
				action="?/delete"
				label="Delete"
				variant="danger"
				fields={{ id: template.id }}
				confirm="Delete this template?"
			/>
		</article>
	{:else}
		<p>No templates yet.</p>
	{/each}
</section>

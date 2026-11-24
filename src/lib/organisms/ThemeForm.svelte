<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'

	/** @type {{ theme: { templateName: string, colors: string, fonts: string, layout: string } }} */
	const { theme } = $props()
</script>

<section class="theme-form">
	<Heading>Theme</Heading>
	<p>
		Your own look for CRE8 ("your tool, your world"). The visual theme editor comes with the design;
		for now the values are stored as JSON.
	</p>
	<form method="POST" action="?/save">
		<TextField label="Template name" name="template_name" value={theme.templateName} />
		<TextareaField label="Colours (JSON)" name="colors" rows={6} value={theme.colors} />
		<TextareaField label="Fonts (JSON)" name="fonts" value={theme.fonts} />
		<TextareaField label="Layout (JSON)" name="layout" value={theme.layout} />
		<Button variant="primary">Save theme</Button>
	</form>
</section>

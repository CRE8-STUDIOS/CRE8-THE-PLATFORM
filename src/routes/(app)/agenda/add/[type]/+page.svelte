<script>
	import { ADD_FORMS } from '#lib/organisms/add/forms.js'

	const { data, form } = $props()
	const Form = $derived(ADD_FORMS[/** @type {keyof typeof ADD_FORMS} */ (data.type)])
	const failed = $derived(
		/** @type {{ answers?: Record<string, string>, errors?: Record<string, string>, sentence?: string } | null} */ (
			form
		)
	)
</script>

<svelte:head><title>Add to agenda · CRE8</title></svelte:head>

<div class="add-page">
	<Form
		action="?/{data.type}"
		answers={failed?.answers ?? data.answers}
		errors={failed?.errors ?? {}}
		sentence={failed?.sentence}
		context={data.context}
		projects={data.projects}
		changeTypeHref="/agenda/add{data.query}"
		closeHref="/agenda"
	/>
</div>

<style>
	.add-page {
		max-inline-size: 35rem;
	}
</style>

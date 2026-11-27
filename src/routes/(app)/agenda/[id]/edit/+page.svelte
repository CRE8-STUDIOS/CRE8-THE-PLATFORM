<script>
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import { ADD_FORMS } from '#lib/organisms/add/forms.js'

	const { data, form } = $props()
	const Form = $derived(ADD_FORMS[/** @type {keyof typeof ADD_FORMS} */ (data.type)])
	const failed = $derived(
		/** @type {{ answers?: Record<string, string>, errors?: Record<string, string>, sentence?: string } | null} */ (
			form
		)
	)
	const details = $derived(
		`/agenda/${data.item.id}${data.occurrence ? `?on=${data.occurrence}` : ''}`
	)
	const LABELS = /** @type {Record<string, string>} */ ({
		task: 'task',
		meeting: 'meeting',
		work: 'work block',
		errand: 'errand',
		deadline: 'deadline',
		rest: 'rest'
	})
</script>

<svelte:head><title>Edit {data.item.title} · CRE8</title></svelte:head>

<div class="edit-page">
	<Form
		action=""
		heading="Edit {LABELS[data.type]}"
		submitLabel="Save changes"
		answers={failed?.answers ?? data.answers}
		errors={failed?.errors ?? {}}
		sentence={failed?.sentence}
		context={data.context}
		projects={data.projects}
		changeTypeHref={null}
		closeHref={details}
	>
		{#snippet before()}
			{#if data.repeating && data.occurrence}
				<PillGroup
					legend="This repeats. Change"
					name="scope"
					options={[
						{ value: 'one', label: 'Only this one' },
						{ value: 'all', label: 'All of them' }
					]}
					value={failed?.answers?.scope ?? 'one'}
				/>
			{/if}
		{/snippet}
	</Form>
</div>

<style>
	.edit-page {
		max-inline-size: 35rem;
	}
</style>

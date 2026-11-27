<script>
	import WorkspaceTileForm from '#lib/organisms/WorkspaceTileForm.svelte'

	const { data, form } = $props()
</script>

<svelte:head><title>{data.form.heading} · CRE8</title></svelte:head>

<div class="tile-page">
	<WorkspaceTileForm
		{...data.form}
		answers={form?.answers ?? data.form.answers}
		errors={form?.errors}
	/>
</div>

<style>
	.tile-page {
		max-inline-size: 35rem;
	}
</style>

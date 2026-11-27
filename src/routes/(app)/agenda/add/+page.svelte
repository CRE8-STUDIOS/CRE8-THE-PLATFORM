<script>
	import AddChooser from '#lib/organisms/add/AddChooser.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Add to agenda · CRE8</title></svelte:head>

<div class="add-page">
	<AddChooser hrefFor={(type) => `/agenda/add/${type}${data.query}`} closeHref="/agenda" />
</div>

<style>
	.add-page {
		max-inline-size: 35rem;
	}
</style>

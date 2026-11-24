<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import TileList from '#lib/organisms/TileList.svelte'
	import TileForm from '#lib/organisms/TileForm.svelte'

	const { data, form } = $props()
	const { tiles } = $derived(data)
</script>

<FormNotice {form} />
<TileList {tiles} />
<TileForm nextPosition={tiles.length} />

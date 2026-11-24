<script>
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import FileList from '#lib/organisms/FileList.svelte'
	import FileUpload from '#lib/organisms/FileUpload.svelte'

	const { data, form } = $props()
	const { files } = $derived(data)
</script>

<FormNotice {form} />
<FileList {files} />
<FileUpload />

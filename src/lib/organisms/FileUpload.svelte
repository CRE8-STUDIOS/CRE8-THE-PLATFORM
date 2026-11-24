<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'
</script>

<section class="file-upload">
	<Heading>Upload a file</Heading>
	<form method="POST" action="?/upload" enctype="multipart/form-data">
		<TextField label="File (max 50 MB)" name="file" type="file" required />
		<CheckboxField label="Share with client" name="shared_with_client" />
		<Button variant="primary">Upload</Button>
	</form>
</section>

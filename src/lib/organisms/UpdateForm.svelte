<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'
</script>

<section class="update-form">
	<Heading>Post an update</Heading>
	<p>Progress posts. Visible ones appear in the client portal.</p>
	<form method="POST" action="?/create">
		<TextField label="Title" name="title" required />
		<TextareaField label="Text" name="body" />
		<CheckboxField label="Visible to client" name="visible_to_client" checked />
		<Button variant="primary">Post update</Button>
	</form>
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ notes: { id: string, title: string | null, body: string | null, projects: { title: string } | null }[] }} */
	const { notes } = $props()
</script>

<section class="note-list">
	<Heading>Your notes</Heading>
	{#each notes as { id, title, body, projects } (id)}
		<article class="note-list-item">
			<form method="POST" action="?/update">
				<Input type="hidden" name="id" value={id} />
				<TextField label="Title" name="title" value={title ?? ''} />
				<TextareaField
					label={projects ? `Note · ${projects.title}` : 'Note'}
					name="body"
					value={body ?? ''}
				/>
				<Button>Save</Button>
			</form>
			<ActionButton
				action="?/delete"
				label="Delete"
				variant="danger"
				fields={{ id }}
				confirm="Delete this note?"
			/>
		</article>
	{:else}
		<p>No notes yet.</p>
	{/each}
</section>

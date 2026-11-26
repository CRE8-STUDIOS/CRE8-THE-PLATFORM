<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'

	/** @type {{ nextPosition: number }} */
	const { nextPosition } = $props()
</script>

<section class="tile-form card rough-edge">
	<Heading>Add an app button</Heading>
	<form method="POST" action="?/add" enctype="multipart/form-data">
		<TextField label="Name" name="name" required />
		<TextField label="Link" name="url" type="url" placeholder="https://..." required />
		<TextField label="Group" name="group_name" placeholder="e.g. Design" />
		<TextField label="Position" name="position" inputmode="numeric" value={nextPosition} />
		<TextField
			label="Icon (optional, max 1 MB)"
			type="file"
			name="icon"
			accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
		/>
		<Button variant="primary">Add</Button>
	</form>
</section>

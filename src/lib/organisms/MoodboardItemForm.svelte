<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import TextareaField from '#lib/molecules/TextareaField.svelte'
	import { MOODBOARD_ITEM_TYPES, toOptions } from '#lib/utils/constants.js'

	let type = $state('text')
</script>

<section class="moodboard-item-form card rough-edge">
	<Heading>Add an item</Heading>
	<form method="POST" action="?/addItem" enctype="multipart/form-data">
		<SelectField
			label="Type"
			name="type"
			options={toOptions(MOODBOARD_ITEM_TYPES)}
			value={type}
			onchange={(event) => (type = event.currentTarget.value)}
		/>
		{#if type === 'image'}
			<TextField label="Image (max 20 MB)" type="file" name="image" accept="image/*" required />
			<TextField label="Caption" name="content" />
		{:else if type === 'color'}
			<TextField label="Colour" type="color" name="content" value="#000000" />
		{:else if type === 'link'}
			<TextField label="Link" type="url" name="content" required />
		{:else}
			<TextareaField label="Text" name="content" rows={2} required />
		{/if}
		<fieldset>
			<legend>Position and size on the board</legend>
			<TextField label="x" name="x" value="0" inputmode="numeric" />
			<TextField label="y" name="y" value="0" inputmode="numeric" />
			<TextField label="Width" name="width" inputmode="numeric" />
			<TextField label="Height" name="height" inputmode="numeric" />
		</fieldset>
		<Button variant="primary">Add</Button>
	</form>
</section>

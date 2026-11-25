<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ items: { id: string, label: string, done: boolean }[] }} */
	const { items } = $props()
</script>

<section class="checklist">
	<Heading>Checklist</Heading>
	<ul>
		{#each items as { id, label, done } (id)}
			<li>
				<ActionButton
					action="?/toggleCheck"
					label={done ? 'Mark as not done' : 'Mark as done'}
					fields={{ id, done }}
				/>
				{label}
				<ActionButton action="?/deleteCheck" label="Remove" fields={{ id }} />
			</li>
		{:else}
			<li>Nothing on the list yet.</li>
		{/each}
	</ul>
	<form method="POST" action="?/addCheck">
		<TextField label="Add to checklist" name="label" placeholder="e.g. camera batteries" required />
		<Button>Add</Button>
	</form>
</section>

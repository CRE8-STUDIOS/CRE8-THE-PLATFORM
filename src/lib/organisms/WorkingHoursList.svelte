<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ groups: { kind: string, title: string, rows: { id: string, text: string }[] }[] }} */
	const { groups } = $props()
</script>

<section class="working-hours-list card rough-edge">
	<Heading>Working hours</Heading>
	{#each groups as { kind, title, rows } (kind)}
		<Heading level={3}>{title}</Heading>
		<ul>
			{#each rows as { id, text } (id)}
				<li>{text} <ActionButton action="?/delete" label="Remove" fields={{ id }} /></li>
			{:else}
				<li>None set.</li>
			{/each}
		</ul>
	{/each}
</section>

<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import MoodboardItems from '#lib/organisms/MoodboardItems.svelte'

	/** @type {{ boards: { id: string, title: string, items: { id: string, type: string, content: string | null, imageUrl: string | null }[] }[] }} */
	const { boards } = $props()
</script>

<section class="portal-moodboards">
	<Heading>Moodboards</Heading>
	{#each boards as { id, title, items } (id)}
		<MoodboardItems {items} {title} />
	{:else}
		<p>No moodboards shared.</p>
	{/each}
</section>

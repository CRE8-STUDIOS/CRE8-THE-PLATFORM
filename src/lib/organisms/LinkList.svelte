<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/**
	 * A titled list of links, with a text when the list is empty.
	 * @type {{ title: string, links: { id: string, text: string, href: string }[], empty: string, level?: 2 | 3 }}
	 */
	const { title, links, empty, level = 2 } = $props()
</script>

<section class="link-list">
	<Heading {level}>{title}</Heading>
	<ul>
		{#each links as { id, text, href } (id)}
			<li><a {href}>{text}</a></li>
		{:else}
			<li>{empty}</li>
		{/each}
	</ul>
</section>

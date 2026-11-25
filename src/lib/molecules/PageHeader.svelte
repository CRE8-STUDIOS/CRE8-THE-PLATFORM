<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ title: string, level?: 1 | 2, back?: { href: string, text: string }, intro?: string }} */
	const { title, level = 1, back, intro } = $props()
</script>

<header class="page-header">
	{#if back}<a class="page-header-back" href={back.href}>Back to {back.text}</a>{/if}
	<Heading {level}>{title}</Heading>
	{#if intro}<p class="page-header-intro">{intro}</p>{/if}
</header>

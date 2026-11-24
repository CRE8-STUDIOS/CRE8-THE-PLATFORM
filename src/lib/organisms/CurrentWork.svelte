<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ clock: { project_id: string | null, projects: { title: string } | null } | null }} */
	const { clock } = $props()
</script>

<section class="current-work">
	<Heading>Now</Heading>
	{#if clock?.projects}
		<p>Working on <a href="/projects/{clock.project_id}">{clock.projects.title}</a></p>
	{:else}
		<p>No project running. <a href="/welcome">Clock in</a></p>
	{/if}
</section>

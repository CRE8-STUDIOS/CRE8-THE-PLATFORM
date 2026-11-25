<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/** @type {{ project: { freelancer_name: string | null, status: string, start_date: string | null, deadline: string | null, briefing: string | null } }} */
	const { project } = $props()
</script>

<section class="project-briefing card rough-edge">
	<p class="project-briefing-meta">
		<StatusLabel status={project.status} />
		<span class="text-small text-muted">
			With {project.freelancer_name ?? 'your freelancer'}{#if project.start_date}
				· start {project.start_date}{/if}{#if project.deadline}
				· deadline {project.deadline}{/if}
		</span>
	</p>
	{#if project.briefing}
		<Heading>Briefing</Heading>
		<p class="project-briefing-text">{project.briefing}</p>
	{/if}
</section>

<style>
	.project-briefing-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
	}

	.project-briefing-text {
		white-space: pre-wrap;
	}
</style>

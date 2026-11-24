<script>
	import { page } from '$app/state'
	import ProjectHeader from '#lib/organisms/ProjectHeader.svelte'
	import ClockPrompt from '#lib/organisms/ClockPrompt.svelte'

	// Template for everything inside a project: header + tabs, the clock-in question, then the tab itself
	const { data, children } = $props()
	const { project, projectTabs, profile, clock } = $derived(data)
</script>

<ProjectHeader {project} tabs={projectTabs} current={page.url.pathname} />
{#if project.status !== 'archived'}
	<ClockPrompt
		projectId={project.id}
		projectTitle={project.title}
		mode={profile?.clock_in_mode ?? 'ask'}
		running={clock?.project_id === project.id}
		current={page.url.pathname}
	/>
{/if}

{@render children()}

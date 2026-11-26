<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ProjectCard from '#lib/molecules/ProjectCard.svelte'
	import CurrentWork from '#lib/organisms/CurrentWork.svelte'
	import TodayAgenda from '#lib/organisms/TodayAgenda.svelte'
	import LinkList from '#lib/organisms/LinkList.svelte'
	import ClockInPrompt from '#lib/organisms/ClockInPrompt.svelte'

	const { data } = $props()
	const {
		today,
		clock,
		agenda,
		dueTasks,
		toDo,
		projectLinks,
		timezone,
		clockInLater,
		choosingProject,
		clockProjects
	} = $derived(data)
</script>

<PageHeader title="Overview" label={today}>
	{#snippet actions()}
		{#if !clock}<a class="button button-primary" href="/overview?clock=choose">Clock in</a>{/if}
	{/snippet}
</PageHeader>

{#if !clock && (!clockInLater || choosingProject)}
	<ClockInPrompt projects={clockProjects} choosing={choosingProject} />
{/if}

<CurrentWork {clock} />

<div class="card-grid">
	<TodayAgenda items={agenda} {dueTasks} timeZone={timezone} />
	<LinkList title="To send or answer" links={toDo} empty="Nothing waiting." />
</div>

<section class="active-projects" aria-labelledby="active-projects-title">
	<h2 id="active-projects-title">Active projects</h2>
	{#if projectLinks.length}
		<ul class="card-grid active-projects-grid">
			{#each projectLinks as { id, text, href } (id)}
				{@const [title, ...meta] = text.split(' · ')}
				<li><ProjectCard {href} {title} status="active" {meta} /></li>
			{/each}
		</ul>
	{:else}
		<p class="empty-state">No active projects.</p>
	{/if}
</section>

<style>
	.active-projects {
		display: grid;
		gap: var(--space-m);
	}

	.active-projects-grid {
		--grid-min: var(--size-grid-m);
		grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-min)), 1fr));
		align-items: stretch;
		padding: 0;
		list-style: none;
	}
</style>

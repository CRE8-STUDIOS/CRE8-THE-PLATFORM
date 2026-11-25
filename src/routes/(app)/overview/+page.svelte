<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import CurrentWork from '#lib/organisms/CurrentWork.svelte'
	import TodayAgenda from '#lib/organisms/TodayAgenda.svelte'
	import LinkList from '#lib/organisms/LinkList.svelte'
	import AppTiles from '#lib/organisms/AppTiles.svelte'

	const { data } = $props()
	const { today, clock, agenda, dueTasks, toDo, projectLinks, tiles, timezone } = $derived(data)
</script>

<PageHeader title="Overview" label={today}>
	{#snippet actions()}
		{#if !clock}<a class="button button-primary" href="/welcome">Clock in</a>{/if}
	{/snippet}
</PageHeader>

<CurrentWork {clock} />

<div class="card-grid">
	<TodayAgenda items={agenda} {dueTasks} timeZone={timezone} />
	<LinkList title="To send or answer" links={toDo} empty="Nothing waiting." />
	<LinkList title="Active projects" links={projectLinks} empty="No active projects." />
</div>

<AppTiles {tiles} />

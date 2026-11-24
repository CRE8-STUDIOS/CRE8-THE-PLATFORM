<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import CurrentWork from '#lib/organisms/CurrentWork.svelte'
	import TodayAgenda from '#lib/organisms/TodayAgenda.svelte'
	import LinkList from '#lib/organisms/LinkList.svelte'
	import AppTiles from '#lib/organisms/AppTiles.svelte'

	const { data } = $props()
	const { today, clock, agenda, dueTasks, toDo, projectLinks, tiles, timezone } = $derived(data)
</script>

<PageHeader title="Overview · {today}" />
<CurrentWork {clock} />
<TodayAgenda items={agenda} {dueTasks} timeZone={timezone} />
<LinkList title="To send or answer" links={toDo} empty="Nothing waiting." />
<LinkList title="Active projects" links={projectLinks} empty="No active projects." />
<AppTiles {tiles} />

<script>
	import { page } from '$app/state'
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import AgendaDetails from '#lib/organisms/AgendaDetails.svelte'
	import Checklist from '#lib/organisms/Checklist.svelte'
	import PeopleList from '#lib/organisms/PeopleList.svelte'

	const { data, form } = $props()
	const { item, checklist, people, canStart, timezone, backHref, confirmDelete, occurrence } =
		$derived(data)
	const on = $derived(occurrence ? `on=${occurrence}` : '')
	const self = $derived(`/agenda/${item.id}${on ? `?${on}` : ''}`)
</script>

<PageHeader title={item.title} back={{ href: backHref, text: 'Agenda' }}>
	{#snippet actions()}
		{#if canStart}
			<ActionButton
				action="/clock?/in"
				label="Start this block (clock in)"
				variant="primary"
				fields={{
					agenda_item_id: item.id,
					project_id: item.project_id,
					started_by: 'manual',
					redirectTo: page.url.pathname
				}}
			/>
		{/if}
	{/snippet}
</PageHeader>

<FormNotice {form} />
<AgendaDetails {item} timeZone={timezone} />

{#if checklist.length}<Checklist items={checklist} />{/if}
<PeopleList {people} />

{#if confirmDelete}
	<form class="item-confirm" method="POST" action="?{on ? `${on}&` : ''}/delete">
		{#if item.recurrence_rule && occurrence}
			<p>
				Delete <strong>{item.title}</strong>, only this one or all of them? This cannot be undone.
			</p>
			<div class="item-actions">
				<OutlineButton href={self}>Cancel</OutlineButton>
				<OutlineButton name="scope" value="one">Only this one</OutlineButton>
				<OutlineButton strong name="scope" value="all">All of them</OutlineButton>
			</div>
		{:else}
			<p>Delete <strong>{item.title}</strong> for good? This cannot be undone.</p>
			<div class="item-actions">
				<OutlineButton href={self}>Cancel</OutlineButton>
				<OutlineButton strong name="scope" value="all">Delete</OutlineButton>
			</div>
		{/if}
	</form>
{:else}
	<div class="item-actions">
		<OutlineButton href="{self}{on ? '&' : '?'}delete">Delete</OutlineButton>
		<OutlineButton href="/agenda/{item.id}/edit{on ? `?${on}` : ''}" strong>Edit</OutlineButton>
	</div>
{/if}

<style>
	.item-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-s);
	}

	.item-confirm {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		max-inline-size: var(--agenda-max-width);
		padding: var(--agenda-item-padding);
		border: var(--line-strong);
		border-radius: var(--radius-item);
	}
</style>

<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import OverviewCard from '#lib/molecules/OverviewCard.svelte'

	/**
	 * The overview before anything is added: no empty boxes, the assistant
	 * explains what will appear, with one action per card.
	 * @type {{ newProjectHref: string }}
	 */
	const { newProjectHref } = $props()

	const cards = $derived([
		{
			id: 'first-meetings',
			heading: 'Meetings',
			text: 'No meetings today. Add one in your agenda, or let clients book one in their portal.',
			action: { href: '/agenda/add/meeting', label: 'Add a meeting' }
		},
		{
			id: 'first-tasks',
			heading: 'Tasks today',
			text: 'Nothing planned. Give a task a date for today and it shows up here.',
			action: { href: '/agenda/add/task', label: 'Add a task' }
		},
		{
			id: 'first-deadlines',
			heading: 'Deadlines',
			text: 'No deadlines coming up. They appear here when a project gets a deadline.',
			action: { href: newProjectHref, label: 'Add a project' }
		}
	])
</script>

<section class="first-day" aria-labelledby="first-day-heading">
	<span class="first-day-face" aria-hidden="true"><Mascot size="6rem" /></span>
	<div class="first-day-text">
		<h2 id="first-day-heading">Your overview is still empty</h2>
		<p>
			This page fills itself with your day: what you work on now, meetings, tasks and deadlines.
			Start with your first project, the rest follows.
		</p>
		<div class="first-day-actions">
			<OutlineButton href={newProjectHref} strong>Add my first project</OutlineButton>
			<OutlineButton href="/guide/app">Take the tour</OutlineButton>
		</div>
	</div>
</section>

<div class="first-day-cards">
	{#each cards as card (card.id)}
		<OverviewCard id={card.id} heading={card.heading}>
			<p class="first-day-quiet">{card.text}</p>
			<a class="first-day-link" href={card.action.href}>{card.action.label}</a>
		</OverviewCard>
	{/each}
</div>

<style>
	.first-day {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-l);
		padding: var(--space-l);
		border: var(--line);
		border-radius: 1.25rem;
	}

	.first-day-face {
		display: flex;
	}

	.first-day-text {
		display: flex;
		flex: 1 1 20rem;
		flex-direction: column;
		gap: var(--space-s);
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.first-day-text p {
		max-inline-size: 36rem;
		font-size: var(--font-size-small);
		line-height: 1.55;
	}

	.first-day-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.first-day-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
		gap: var(--space-m);
		align-items: start;
	}

	.first-day-quiet {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.5;
	}

	.first-day-link {
		align-self: flex-start;
		color: var(--color-text);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

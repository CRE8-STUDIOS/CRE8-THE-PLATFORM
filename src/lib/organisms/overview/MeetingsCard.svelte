<script>
	import OverviewCard from '#lib/molecules/OverviewCard.svelte'
	import OverviewRow from '#lib/molecules/OverviewRow.svelte'

	/**
	 * Today's meetings, and under them what is waiting to be sent or signed.
	 * Titles and states only, never an amount.
	 * @type {{
	 *   meetings: { id: string, href: string, time: string, title: string, place: string | null, end: string | null }[],
	 *   toSend: { id: string, kind: string, title: string, line: string, status: string, href: string }[]
	 * }}
	 */
	const { meetings, toSend } = $props()
</script>

<OverviewCard id="meetings-heading" heading="Meetings" meta="{meetings.length} today">
	{#if meetings.length}
		<ul class="overview-list">
			{#each meetings as meeting (meeting.id + meeting.time)}
				<OverviewRow
					href={meeting.href}
					title="{meeting.time} · {meeting.title}"
					line={meeting.place}
					end={meeting.end}
				/>
			{/each}
		</ul>
	{:else}
		<p class="overview-quiet">No meetings today.</p>
	{/if}

	<div class="overview-sub">
		<h2 id="to-send-heading">To send and sign</h2>
		{#if toSend.length}<span>{toSend.length}</span>{/if}
	</div>
	{#if toSend.length}
		<ul class="overview-list" aria-labelledby="to-send-heading">
			{#each toSend as item (item.kind + item.id)}
				<OverviewRow
					href={item.href}
					title="{item.kind} · {item.title}"
					line={item.line}
					end={item.status}
				/>
			{/each}
		</ul>
	{:else}
		<p class="overview-quiet">Nothing waiting to be sent or signed.</p>
	{/if}
</OverviewCard>

<style>
	.overview-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.overview-quiet {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.5;
	}

	.overview-sub {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-xs);
		margin-block-start: var(--space-s);
	}

	.overview-sub h2 {
		font-size: var(--font-size-agenda-meta);
		font-weight: 800;
		text-transform: uppercase;
	}

	.overview-sub span {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}
</style>

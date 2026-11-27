<script>
	import OverviewCard from '#lib/molecules/OverviewCard.svelte'
	import OverviewRow from '#lib/molecules/OverviewRow.svelte'

	/**
	 * Project and agenda deadlines in the next two weeks, the nearest bold.
	 * @type {{ deadlines: { id: string, title: string, href: string, line: string | null, when: string }[], days: number }}
	 */
	const { deadlines, days } = $props()
</script>

<OverviewCard id="deadlines-heading" heading="Deadlines" meta="next {days} days">
	{#if deadlines.length}
		<ul class="deadlines">
			{#each deadlines as deadline, index (deadline.id)}
				<OverviewRow
					href={deadline.href}
					title={deadline.title}
					line={deadline.line}
					end={deadline.when}
					strong={index === 0}
				/>
			{/each}
		</ul>
	{:else}
		<p class="deadlines-quiet">
			No deadlines coming up. They appear here when a project gets a deadline.
		</p>
	{/if}
</OverviewCard>

<style>
	.deadlines {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.deadlines-quiet {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.5;
	}
</style>

<script>
	import ClockInPrompt from '#lib/organisms/ClockInPrompt.svelte'
	import ClockControl from '#lib/organisms/overview/ClockControl.svelte'

	const { data } = $props()

	const showPrompt = $derived(
		(!data.clock && (!data.clockInLater || data.choosingProject)) ||
			(Boolean(data.clock) && data.switchingProject)
	)
</script>

<svelte:head><title>Overview · CRE8</title></svelte:head>

<div class="overview">
	<header class="overview-header" data-tour="greeting">
		<div>
			<span class="overview-date">{data.dateLabel}</span>
			<h1>Overview</h1>
		</div>
		<div data-tour="clock-in">
			<ClockControl
				clock={data.clock && {
					started_at: data.clock.started_at,
					project: data.clock.projects?.title ?? null
				}}
				closedMinutes={data.closedMinutes}
				now={data.now}
				canSwitch={data.clockProjects.length > 0}
			/>
		</div>
	</header>
</div>

{#if showPrompt}
	<ClockInPrompt
		projects={data.clockProjects}
		choosing={data.choosingProject}
		switching={Boolean(data.clock) && data.switchingProject}
	/>
{/if}

<style>
	.overview {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		min-inline-size: 0;
		max-inline-size: var(--agenda-max-width);
	}

	.overview-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--space-m);
	}

	.overview-header > div:first-child {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.overview-date {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}
</style>

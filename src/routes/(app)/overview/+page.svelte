<script>
	import ClockInPrompt from '#lib/organisms/ClockInPrompt.svelte'
	import ClockControl from '#lib/organisms/overview/ClockControl.svelte'
	import RightNow from '#lib/organisms/overview/RightNow.svelte'
	import UpNext from '#lib/organisms/overview/UpNext.svelte'

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

	<div class="overview-now">
		<RightNow now={data.rightNow} />
		<div data-tour="planning"><UpNext suggestions={data.upNext} /></div>
	</div>
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

	.overview-now {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 21rem), 1fr));
		gap: var(--space-m);
		align-items: stretch;
	}

	@media (width >= 60rem) {
		.overview-now {
			grid-template-columns: 1.4fr 1fr;
		}
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}
</style>

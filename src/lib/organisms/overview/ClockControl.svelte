<script>
	import { untrack } from 'svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import { clockSentence, clockText, minutesBetween } from '#lib/overview/helpers.js'

	/**
	 * The one clock control of the overview. Clocked in: the running time,
	 * the project, SWITCH and CLOCK OUT. Not clocked in: today's time and
	 * CLOCK IN. Without JavaScript the time is as of page load.
	 * @type {{
	 *   clock: { started_at: string, project: string | null } | null,
	 *   closedMinutes: number,
	 *   now: string,
	 *   canSwitch: boolean
	 * }}
	 */
	const { clock, closedMinutes, now: loadedAt, canSwitch } = $props()

	let now = $state(untrack(() => loadedAt))

	$effect(() => {
		now = new Date().toISOString()
		const timer = setInterval(() => (now = new Date().toISOString()), 15_000)
		return () => clearInterval(timer)
	})

	const running = $derived(clock ? minutesBetween(clock.started_at, now) : 0)
	/** The sentence only changes once a minute, so screen readers are not flooded */
	const sentence = $derived(clock ? clockSentence(running, clock.project) : '')
</script>

<div class="clock-control" role="group" aria-label="Clock">
	{#if clock}
		<div class="clock-control-pill" role="img" aria-label={sentence}>
			<span class="clock-control-time" aria-hidden="true">{clockText(running)}</span>
			<span class="clock-control-project" aria-hidden="true">{clock.project ?? 'No project'}</span>
		</div>
		{#if canSwitch}<OutlineButton href="/overview?clock=switch">Switch</OutlineButton>{/if}
		<form method="POST" action="/clock?/out">
			<input type="hidden" name="redirectTo" value="/overview" />
			<OutlineButton strong>Clock out</OutlineButton>
		</form>
	{:else}
		<span class="clock-control-quiet">
			Not clocked in · <span class="clock-control-time">{clockText(closedMinutes)}</span> today
		</span>
		<OutlineButton href="/overview?clock=choose" strong>Clock in</OutlineButton>
	{/if}
</div>

<style>
	.clock-control {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
	}

	.clock-control-pill {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-block-size: var(--size-touch);
		padding: var(--space-2xs) var(--space-m);
		border: var(--line);
		border-radius: var(--radius-pill);
		line-height: 1.2;
	}

	.clock-control-time {
		font-size: var(--font-size-small);
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	.clock-control-project {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}

	.clock-control-quiet {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.clock-control-quiet .clock-control-time {
		font-size: inherit;
		font-weight: 700;
	}
</style>

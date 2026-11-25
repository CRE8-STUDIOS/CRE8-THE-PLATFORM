<script>
	import { refreshAll } from '$app/navigation'
	import Button from '#lib/atoms/Button.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * @type {{
	 *   clock: { started_at: string, category: string, project_id: string | null, projects: { title: string } | null } | null,
	 *   supabase: import('@supabase/supabase-js').SupabaseClient<import('#lib/database.types.js').Database>,
	 *   timeZone: string,
	 *   checkInAfterMinutes: number,
	 *   current: string
	 * }}
	 */
	const { clock, supabase, timeZone, checkInAfterMinutes, current } = $props()

	const HEARTBEAT_MS = 60_000
	const ANSWER_WITHIN_MS = 10 * 60_000

	let lastActivity = $state(Date.now())
	/** @type {number | null} */
	let askedAt = $state(null)

	$effect(() => {
		if (!clock) return
		const beat = () => supabase.rpc('clock_heartbeat')
		beat()
		const interval = setInterval(beat, HEARTBEAT_MS)
		return () => clearInterval(interval)
	})

	$effect(() => {
		const events = ['pointerdown', 'keydown', 'scroll', 'focus']
		const markActive = () => {
			if (askedAt === null) lastActivity = Date.now()
		}
		for (const name of events) window.addEventListener(name, markActive, { passive: true })
		return () => {
			for (const name of events) window.removeEventListener(name, markActive)
		}
	})

	$effect(() => {
		if (!clock) return
		const limit = checkInAfterMinutes * 60_000
		const interval = setInterval(async () => {
			const now = Date.now()
			if (askedAt === null && now - lastActivity > limit) askedAt = now
			else if (askedAt !== null && now - askedAt > ANSWER_WITHIN_MS) {
				await supabase.rpc('clock_out', {
					p_reason: 'no_answer',
					p_at: new Date(askedAt).toISOString()
				})
				askedAt = null
				await refreshAll()
			}
		}, 30_000)
		return () => clearInterval(interval)
	})

	const keepWorking = () => {
		askedAt = null
		lastActivity = Date.now()
	}
</script>

<section class="clock-status" aria-label="Clock">
	{#if clock}
		<p class="clock-status-pill rough-edge">
			<span class="clock-status-dot" aria-hidden="true"></span>
			<span>
				Clocked in
				{#if clock.projects}on <a href="/projects/{clock.project_id}">
						{clock.projects.title}
					</a>{:else}({clock.category.replaceAll('_', ' ')}){/if}
				since <DateTime value={clock.started_at} {timeZone} show="time" />
			</span>
		</p>
		<ActionButton action="/clock?/out" label="Clock out" fields={{ redirectTo: current }} />

		{#if askedAt !== null}
			<div
				class="clock-status-question card rough-edge"
				role="alertdialog"
				aria-labelledby="still-working"
			>
				<p id="still-working" class="card-title">
					Still working on {clock.projects?.title ?? 'this'}?
				</p>
				<div class="button-group">
					<Button type="button" variant="primary" onclick={keepWorking}>
						Yes, keep the clock running
					</Button>
					<ActionButton
						action="/clock?/out"
						label="No, I stopped"
						fields={{ redirectTo: current, at: new Date(askedAt).toISOString() }}
					/>
				</div>
			</div>
		{/if}
	{:else}
		<p>
			<span class="visually-hidden">Not clocked in.</span>
			<a class="button button-secondary button-small rough-edge" href="/welcome">Clock in</a>
		</p>
	{/if}
</section>

<style>
	.clock-status {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs);
	}

	.clock-status-pill {
		--rough-edge-background: var(--color-button-secondary);
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		padding-block: var(--space-xs);
		padding-inline: var(--space-s);
		border-radius: var(--radius-pill);
		font-size: var(--font-size-small);
		line-height: var(--line-height-heading);
	}

	.clock-status-dot {
		inline-size: var(--space-xs);
		block-size: var(--space-xs);
		border-radius: 50%;
		background-color: var(--color-status-paid-text);
	}

	.clock-status-question {
		position: fixed;
		inset-block-end: var(--space-m);
		inset-inline: var(--space-m);
		z-index: 20;
		max-inline-size: var(--size-narrow);
		margin-inline: auto;
	}
</style>

<script>
	import OverviewCard from '#lib/molecules/OverviewCard.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'

	/**
	 * What you are working on now, or what comes next today.
	 * @type {{
	 *   now: {
	 *     when: string,
	 *     title: string,
	 *     line: string,
	 *     nextStep: string | null,
	 *     progress: { done: number, total: number } | null,
	 *     projectId: string | null
	 *   } | null
	 * }}
	 */
	const { now } = $props()

	const percent = $derived(
		now?.progress?.total ? Math.round((now.progress.done / now.progress.total) * 100) : 0
	)
</script>

<OverviewCard id="right-now-heading" heading="Right now" meta={now?.when ?? ''} class="right-now">
	{#if now}
		<p class="right-now-title">{now.title}</p>
		{#if now.line}<p class="right-now-line">{now.line}</p>{/if}
		{#if now.nextStep || now.progress}
			<div class="right-now-progress">
				<div class="right-now-progress-text">
					{#if now.nextStep}<span>Next step: {now.nextStep}</span>{/if}
					{#if now.progress}<span>{now.progress.done} of {now.progress.total} done</span>{/if}
				</div>
				{#if now.progress}
					<span class="right-now-track" aria-hidden="true">
						<span style:inline-size="{percent}%"></span>
					</span>
				{/if}
			</div>
		{/if}
		{#if now.projectId}
			<div class="right-now-links">
				<OutlineButton href="/projects/{now.projectId}" strong>Open project</OutlineButton>
				<OutlineButton href="/moodboards?project={now.projectId}">Moodboard</OutlineButton>
				<OutlineButton href="/notes?project={now.projectId}">Notes</OutlineButton>
			</div>
		{/if}
	{:else}
		<p class="right-now-line">
			Nothing planned right now. <a href="/agenda">Open my agenda</a>
		</p>
	{/if}
</OverviewCard>

<style>
	.right-now-title {
		font-size: clamp(1.375rem, 1.1rem + 1vw, 1.75rem);
		font-weight: 800;
		line-height: 1.15;
		text-transform: uppercase;
	}

	.right-now-line {
		font-size: var(--font-size-small);
		line-height: 1.55;
	}

	.right-now-line a {
		color: var(--color-text);
		font-weight: 700;
	}

	.right-now-progress {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.right-now-progress-text {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-xs);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.right-now-track {
		position: relative;
		border-block-start: var(--line-quiet);
	}

	.right-now-track span {
		position: absolute;
		inset-block-start: -0.125rem;
		inset-inline-start: 0;
		border-block-start: 0.1875rem solid var(--line-color);
	}

	.right-now-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}
</style>

<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import ProgressLine from '#lib/molecules/ProgressLine.svelte'

	const { data } = $props()
</script>

<svelte:head><title>{data.finished.title} · CRE8</title></svelte:head>

<div class="lesson-done">
	<span class="lesson-done-face" aria-hidden="true"><Mascot size="8.75rem" /></span>
	<span class="lesson-done-meta">Lesson {data.number} of {data.total} done</span>
	<h1>{data.finished.title}</h1>
	<p>{data.finished.line}</p>
	<div class="lesson-done-actions">
		<OutlineButton href={data.finished.cta.href} strong={!data.next}>
			{data.finished.cta.label}
		</OutlineButton>
		{#if data.next}
			<OutlineButton href={data.next.href} strong>Next: {data.next.title}</OutlineButton>
		{/if}
	</div>
	<div class="lesson-done-progress">
		<ProgressLine done={data.done} total={data.total} />
	</div>
</div>

<style>
	.lesson-done {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
		padding-block: var(--space-2xl, 3.75rem);
		text-align: center;
	}

	.lesson-done-face {
		display: flex;
	}

	.lesson-done-meta {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	h1 {
		font-size: clamp(1.75rem, 1.4rem + 1.8vw, 2.5rem);
		line-height: 1.1;
		text-transform: uppercase;
	}

	p {
		max-inline-size: 32.5rem;
		font-size: var(--font-size-small);
		line-height: 1.6;
	}

	.lesson-done-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-xs);
	}

	.lesson-done-progress {
		inline-size: min(26.25rem, 100%);
		margin-block-start: var(--space-s);
	}
</style>

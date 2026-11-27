<script>
	import MascotSays from '#lib/molecules/MascotSays.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import ProgressLine from '#lib/molecules/ProgressLine.svelte'

	const { data } = $props()
	const tour = $derived(data.tour)
</script>

<svelte:head><title>{tour.chapter.title} · How CRE8 THE PLATFORM works · CRE8</title></svelte:head>

<div class="tour">
	<aside class="tour-chapters" aria-labelledby="tour-chapters-heading">
		<div class="tour-chapters-heading">
			<h2 id="tour-chapters-heading">The tour</h2>
			<span>{tour.chapter.number} of {tour.chapters}</span>
		</div>
		<ol>
			{#each data.chapters as chapter (chapter.slug)}
				<li class="is-{chapter.state}">
					<a
						href="/guide/app/{chapter.slug}"
						aria-current={chapter.slug === tour.chapter.slug ? 'step' : undefined}
					>
						<span class="tour-mark" aria-hidden="true">
							{chapter.state === 'done' ? '✓' : chapter.number}
						</span>
						{chapter.title}
						{#if chapter.state === 'done'}<span class="visually-hidden">(done)</span>{/if}
					</a>
				</li>
			{/each}
		</ol>
		<ProgressLine done={data.done} total={tour.chapters} />
	</aside>

	<section class="tour-step" aria-labelledby="tour-step-heading">
		<div class="tour-step-heading">
			<span>Step {tour.step + 1} of {tour.steps}</span>
			<h1 id="tour-step-heading">{tour.chapter.title}</h1>
		</div>

		{#key `${tour.chapter.slug}-${tour.step}`}
			<MascotSays big>
				<p>{tour.current.text}</p>
			</MascotSays>
		{/key}

		<div class="tour-actions">
			{#if tour.back}
				<OutlineButton href={tour.back}><span aria-hidden="true">‹</span> Back</OutlineButton>
			{/if}
			<form method="POST" action="?/next">
				<input type="hidden" name="step" value={tour.step} />
				<OutlineButton strong>
					{#if !tour.last}Next{:else if tour.nextChapter}Next: {tour.nextChapter.title}{:else}Finish
						the tour{/if}
				</OutlineButton>
			</form>
			{#if tour.inApp}
				<a class="tour-show" href={tour.inApp.here}>Show me in the app</a>
			{/if}
		</div>
	</section>
</div>

<style>
	.tour {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--space-xl);
	}

	.tour-chapters {
		display: flex;
		flex: 1 1 14rem;
		flex-direction: column;
		gap: var(--space-s);
		min-inline-size: 0;
	}

	.tour-chapters-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-block-end: var(--space-xs);
		border-block-end: var(--line);
	}

	.tour-chapters-heading h2 {
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}

	.tour-chapters-heading span {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ol a {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		min-block-size: var(--size-touch);
		color: var(--color-text);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-decoration: none;
	}

	ol a:hover {
		text-decoration: underline;
	}

	.is-todo a {
		color: var(--color-text-calm);
	}

	ol a[aria-current='step'] {
		text-decoration: underline;
		text-decoration-thickness: var(--line-width-strong);
		text-underline-offset: 0.4em;
	}

	.tour-mark {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		inline-size: 2rem;
		block-size: 2rem;
		border: var(--line);
		border-radius: var(--radius-pill);
		font-size: var(--font-size-agenda-label);
	}

	.is-todo .tour-mark {
		border-color: var(--line-color-quiet);
	}

	[aria-current='step'] .tour-mark {
		border: var(--line-strong);
	}

	.tour-step {
		display: flex;
		flex: 999 1 26rem;
		flex-direction: column;
		gap: var(--space-l);
		min-inline-size: 0;
	}

	.tour-step-heading {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.tour-step-heading span {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.tour-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-xs) var(--space-m);
		padding-inline-start: calc(3.25rem + var(--space-s));
	}

	.tour-show {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

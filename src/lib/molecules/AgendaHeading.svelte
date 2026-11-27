<script>
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'

	/**
	 * @type {{
	 *   title: string,
	 *   meta?: string,
	 *   view: 'day' | 'week' | 'month',
	 *   views: { day: string, week: string, month: string },
	 *   previous: { href: string, label: string },
	 *   next: { href: string, label: string }
	 * }}
	 */
	const { title, meta = '', view, views, previous, next } = $props()

	/** @type {('day' | 'week' | 'month')[]} */
	const VIEWS = ['day', 'week', 'month']
</script>

<div class="agenda-heading">
	<div class="agenda-heading-title">
		<h1>{title}</h1>
		{#if meta}<span class="agenda-heading-meta">{meta}</span>{/if}
	</div>
	<div class="agenda-heading-tools">
		<nav class="agenda-views" aria-label="Agenda view">
			{#each VIEWS as option (option)}
				<a href={views[option]} aria-current={option === view ? 'page' : undefined}>{option}</a>
			{/each}
		</nav>
		<div class="agenda-steps">
			<OutlineButton href={previous.href} round aria-label={previous.label}>
				<span aria-hidden="true">‹</span>
			</OutlineButton>
			<OutlineButton href={next.href} round aria-label={next.label}>
				<span aria-hidden="true">›</span>
			</OutlineButton>
		</div>
	</div>
</div>

<style>
	.agenda-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
	}

	.agenda-heading-title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-s);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.agenda-heading-meta {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.agenda-heading-tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-m);
	}

	.agenda-views {
		display: flex;
		gap: var(--space-s);
	}

	.agenda-views a {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.agenda-views a[aria-current='page'] {
		color: var(--color-text);
		text-decoration: underline;
		text-decoration-thickness: var(--line-width-strong);
		text-underline-offset: 0.4em;
	}

	.agenda-steps {
		display: flex;
		gap: var(--space-xs);
	}
</style>

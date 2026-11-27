<script>
	/**
	 * A calm list of upcoming appointments: when as a quiet line, then the title.
	 * @type {{ heading: string, rows: { key: string, when: string, title: string, href: string }[], empty: string }}
	 */
	const { heading, rows, empty } = $props()
	const id = $derived(`appointments-${heading.toLowerCase()}`)
</script>

<section class="appointments" aria-labelledby={id}>
	<h2 {id}>{heading} <span>{rows.length}</span></h2>
	{#if rows.length}
		<ul>
			{#each rows as row (row.key)}
				<li>
					<a href={row.href}>
						<span class="appointment-when">{row.when}</span>
						<span class="appointment-title">{row.title}</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="appointments-empty">{empty}</p>
	{/if}
</section>

<style>
	.appointments {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-inline-size: 0;
	}

	h2 {
		display: flex;
		align-items: baseline;
		gap: var(--space-xs);
		padding-block-end: var(--space-xs);
		border-block-end: var(--line-strong);
		font-size: var(--font-size-small);
		text-transform: uppercase;
	}

	h2 span {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-block: var(--space-xs);
		border-block-end: var(--line-quiet);
		color: var(--color-text);
		text-decoration: none;
	}

	a:hover .appointment-title {
		text-decoration: underline;
	}

	.appointment-when {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.appointment-title {
		font-size: var(--font-size-small);
		font-weight: 700;
	}

	.appointments-empty {
		padding: var(--space-s);
		border: var(--line-dashed);
		border-radius: var(--radius-item-small);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

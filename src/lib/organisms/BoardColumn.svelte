<script>
	/**
	 * One column of the project board: cards with a title and one status line.
	 * @type {{ heading: string, cards: { id: string, title: string, status: string }[] }}
	 */
	const { heading, cards } = $props()
	const id = $derived(`board-${heading.toLowerCase().replaceAll(' ', '-')}`)
</script>

<section class="board-column" aria-labelledby={id}>
	<h2 {id}>{heading} <span>{cards.length}</span></h2>
	<ul>
		{#each cards as card (card.id)}
			<li>
				<a href="/agenda/{card.id}">
					<span class="board-card-title">{card.title}</span>
					{#if card.status}<span class="board-card-status">{card.status}</span>{/if}
				</a>
			</li>
		{:else}
			<li class="board-empty">Nothing here</li>
		{/each}
	</ul>
</section>

<style>
	.board-column {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
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
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding: var(--space-s);
		border: var(--line);
		border-radius: var(--radius-item-small);
		color: var(--color-text);
		text-decoration: none;
	}

	a:hover .board-card-title {
		text-decoration: underline;
	}

	.board-card-title {
		font-size: var(--font-size-small);
		font-weight: 700;
	}

	.board-card-status {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.board-empty {
		display: flex;
		align-items: center;
		min-block-size: 4.5rem;
		padding: var(--space-s);
		border: var(--line-dashed);
		border-radius: var(--radius-item-small);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

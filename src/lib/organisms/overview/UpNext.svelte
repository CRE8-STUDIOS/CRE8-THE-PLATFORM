<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import OverviewCard from '#lib/molecules/OverviewCard.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'

	/**
	 * The assistant's most important suggestion, with the others folded away.
	 * @type {{ suggestions: { id: string, href: string, title: string, text: string }[] }}
	 */
	const { suggestions } = $props()

	const first = $derived(suggestions[0] ?? null)
	const more = $derived(suggestions.slice(1))
</script>

<OverviewCard id="up-next-heading" heading="Up next" class="up-next">
	{#snippet lead()}
		<span class="up-next-face overview-card-lead" aria-hidden="true">
			<Mascot size="3rem" animate={false} />
		</span>
	{/snippet}
	{#if first}
		<p class="up-next-title">{first.title}</p>
		{#if first.text}<p class="up-next-text">{first.text}</p>{/if}
	{:else}
		<p class="up-next-text">Nothing else planned today. A good moment for the tasks of today.</p>
	{/if}
	<div class="up-next-actions">
		<OutlineButton href="/agenda">See my day</OutlineButton>
		{#if more.length}
			<details class="up-next-more">
				<summary>+{more.length} more</summary>
				<ul>
					{#each more as suggestion (suggestion.id)}
						<li>
							<a href={suggestion.href}>{suggestion.title}</a>
							{#if suggestion.text}<p>{suggestion.text}</p>{/if}
						</li>
					{/each}
				</ul>
			</details>
		{/if}
	</div>
</OverviewCard>

<style>
	.up-next-face {
		display: flex;
	}

	.up-next-title {
		font-size: 1.25rem;
		font-weight: 800;
		line-height: 1.25;
	}

	.up-next-text {
		font-size: var(--font-size-small);
		line-height: 1.55;
	}

	.up-next-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--space-xs);
	}

	summary {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		padding-inline: var(--space-m);
		border: var(--line);
		border-radius: var(--radius-pill);
		font-size: var(--font-size-label);
		font-weight: 800;
		text-transform: uppercase;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.up-next-more ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		margin: var(--space-s) 0 0;
		padding: 0;
		list-style: none;
	}

	.up-next-more a {
		color: var(--color-text);
		font-size: var(--font-size-small);
		font-weight: 700;
	}

	.up-next-more p {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

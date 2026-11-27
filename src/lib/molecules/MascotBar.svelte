<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/**
	 * One mascot message per screen, with its actions and a count of the rest.
	 * Shows nothing when there is no message.
	 * @type {{ message?: string | null, more?: number, moreHref?: string, actions?: import('svelte').Snippet }}
	 */
	const { message = null, more = 0, moreHref, actions } = $props()
</script>

{#if message}
	<aside class="mascot-bar" aria-label="Assistant">
		<span class="mascot-bar-face" aria-hidden="true">
			<Mascot size="2.25rem" animate={false} />
		</span>
		<p class="mascot-bar-message">{message}</p>
		{@render actions?.()}
		{#if more > 0}
			<a class="mascot-bar-more" href={moreHref ?? '#'} aria-label="Show {more} more suggestions">
				+{more}
			</a>
		{/if}
	</aside>
{/if}

<style>
	.mascot-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-s);
		max-inline-size: var(--agenda-max-width);
		padding: var(--space-xs) var(--space-xs) var(--space-xs) var(--space-s);
		border: var(--line);
		border-radius: var(--radius-pill);
	}

	.mascot-bar-face {
		display: flex;
	}

	.mascot-bar-message {
		flex: 1 1 16rem;
		font-size: var(--font-size-small);
		font-weight: 600;
	}

	.mascot-bar-more {
		display: inline-flex;
		align-items: center;
		min-block-size: var(--size-touch);
		padding-inline: var(--space-xs);
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
	}
</style>

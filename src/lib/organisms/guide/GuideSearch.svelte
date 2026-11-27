<script>
	import { untrack } from 'svelte'
	import { searchGuide } from '#lib/guide/progress.js'

	/**
	 * Search through the guide. It filters while typing, and without
	 * JavaScript the form sends ?q= and the page shows the same results.
	 * @type {{
	 *   entries: import('#lib/guide/progress.js').SearchEntry[],
	 *   query?: string,
	 *   action: string,
	 *   label: string,
	 *   placeholder: string
	 * }}
	 */
	const { entries, query: initialQuery = '', action, label, placeholder } = $props()

	let query = $state(untrack(() => initialQuery))
	const results = $derived(searchGuide(entries, query))

	const KIND = { lesson: 'Lesson', tour: 'Tour', word: 'Word' }
</script>

<form class="guide-search" method="GET" {action} role="search">
	<label for="guide-search">{label}</label>
	<div class="guide-search-row">
		<input id="guide-search" type="search" name="q" bind:value={query} {placeholder} />
		<noscript><button>Search</button></noscript>
	</div>
</form>

{#if query.trim()}
	<p class="visually-hidden" role="status">
		{results.length}
		{results.length === 1 ? 'result' : 'results'}
	</p>
	{#if results.length}
		<ul class="guide-results">
			{#each results as result (result.href)}
				<li>
					<a href={result.href}>
						<span class="guide-result-kind">{KIND[result.kind]}</span>
						<span class="guide-result-title">{result.title}</span>
						<span class="guide-result-text">{result.text}</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="guide-results-empty">Nothing found for "{query.trim()}". Try another word.</p>
	{/if}
{/if}

<style>
	.guide-search {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	label {
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
	}

	.guide-search-row {
		display: flex;
		gap: var(--space-xs);
	}

	input {
		flex: 1;
		min-inline-size: 0;
		min-block-size: var(--size-touch);
		padding-inline: var(--space-m);
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
	}

	button {
		min-block-size: var(--size-touch);
		padding-inline: var(--space-m);
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
		font-weight: 700;
		text-transform: uppercase;
	}

	.guide-results {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.guide-results li {
		border-block-end: var(--line-quiet);
	}

	.guide-results a {
		display: grid;
		grid-template-columns: 4.5rem 1fr;
		gap: var(--space-2xs) var(--space-s);
		padding-block: var(--space-s);
		color: var(--color-text);
		text-decoration: none;
	}

	.guide-results a:hover .guide-result-title {
		text-decoration: underline;
	}

	.guide-result-kind {
		grid-row: span 2;
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-transform: uppercase;
	}

	.guide-result-title {
		font-size: var(--font-size-small);
		font-weight: 700;
	}

	.guide-result-text,
	.guide-results-empty {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.guide-result-text {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
</style>

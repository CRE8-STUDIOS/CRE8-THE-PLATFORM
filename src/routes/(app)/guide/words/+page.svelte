<script>
	import { untrack } from 'svelte'
	import { searchGuide } from '#lib/guide/progress.js'

	const { data } = $props()

	let query = $state(untrack(() => data.query))

	/** Every word, or the ones that match the search */
	const shown = $derived.by(() => {
		if (!query.trim()) return data.words
		const found = new Set(
			searchGuide(
				data.words.map((entry) => ({
					kind: /** @type {const} */ ('word'),
					title: entry.word,
					text: entry.meaning,
					href: entry.id
				})),
				query
			).map((entry) => entry.href)
		)
		return data.words.filter((entry) => found.has(entry.id))
	})
</script>

<svelte:head><title>Words · Guide · CRE8</title></svelte:head>

<h1>Words, in plain language</h1>

<form class="words-search" method="GET" role="search">
	<label for="words-search">Search words</label>
	<div>
		<input
			id="words-search"
			type="search"
			name="q"
			bind:value={query}
			placeholder="Search a word"
		/>
		<noscript><button>Search</button></noscript>
	</div>
</form>

<p class="visually-hidden" role="status">
	{shown.length}
	{shown.length === 1 ? 'word' : 'words'}
</p>

{#if shown.length}
	<dl class="words">
		{#each shown as entry (entry.id)}
			<div id={entry.id}>
				<dt>{entry.word}</dt>
				<dd>{entry.meaning}</dd>
			</div>
		{/each}
	</dl>
{:else}
	<p class="words-empty">No word found for "{query.trim()}". Try another one.</p>
{/if}

<p class="words-note">This guide explains how things work. It is not tax advice.</p>

<style>
	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1.05;
		text-transform: uppercase;
	}

	.words-search {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.words-search div {
		display: flex;
		gap: var(--space-xs);
	}

	label {
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
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

	.words {
		margin: 0;
		border-block-start: var(--line);
	}

	.words div {
		display: grid;
		grid-template-columns: minmax(8rem, 14rem) 1fr;
		gap: var(--space-2xs) var(--space-m);
		padding-block: var(--space-s);
		border-block-end: var(--line-quiet);
		scroll-margin-block-start: var(--space-xl);
	}

	.words div:target {
		outline: var(--line-width) dashed var(--line-color);
		outline-offset: 0.375rem;
	}

	@media (width < 36rem) {
		.words div {
			grid-template-columns: 1fr;
		}
	}

	dt {
		font-size: var(--font-size-small);
		font-weight: 800;
	}

	dd {
		margin: 0;
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.55;
	}

	.words-empty,
	.words-note {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

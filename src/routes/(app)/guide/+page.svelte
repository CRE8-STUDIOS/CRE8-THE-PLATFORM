<script>
	import MascotSays from '#lib/molecules/MascotSays.svelte'
	import TrackCard from '#lib/molecules/TrackCard.svelte'
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import GuideSearch from '#lib/organisms/guide/GuideSearch.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Guide · CRE8</title></svelte:head>

<h1 class="visually-hidden">Guide</h1>

<MascotSays big>
	<p>
		Hi{data.firstName ? ` ${data.firstName}` : ''}. I will show you how the platform works, and how
		freelancing works with money. Short lessons, no difficult words. Where do you want to start?
	</p>
</MascotSays>

<ul class="guide-tracks">
	{#each data.tracks as track (track.href)}
		<li><TrackCard {...track} /></li>
	{/each}
</ul>

<CalmSection id="words-heading" heading="Don't know a word?">
	{#snippet aside()}
		<a href="/guide/words">All words</a>
	{/snippet}
	<GuideSearch
		entries={data.entries}
		query={data.query}
		action="/guide"
		label="Search the guide"
		placeholder="Search, for example btw, factuur or KOR"
	/>
	<p class="guide-note">
		This guide explains how things work. It is not tax advice. For your own situation, ask the
		Belastingdienst or an accountant.
	</p>
</CalmSection>

<style>
	.guide-tracks {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		gap: var(--space-m);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.guide-tracks li {
		display: grid;
	}

	.guide-note {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}
</style>

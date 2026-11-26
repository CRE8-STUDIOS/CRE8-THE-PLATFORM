<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/** @type {{ summary: string }} */
	const { summary } = $props()
</script>

<section class="intro" aria-labelledby="intro-title">
	<h1 id="intro-title" class="intro-title">On today planning</h1>

	<Mascot size="10rem" />

	{#if summary}<p class="intro-summary">{summary}</p>{/if}

	<a class="button button-primary" href="/overview">Lets get to work</a>
</section>

<style>
	.intro {
		display: grid;
		justify-items: center;
		gap: var(--space-m);
		max-inline-size: var(--size-narrow);
		text-align: center;
	}

	.intro-title {
		font-size: var(--font-size-welcome);
	}

	.intro-summary {
		line-height: var(--line-height-body);
		text-transform: uppercase;
	}
</style>

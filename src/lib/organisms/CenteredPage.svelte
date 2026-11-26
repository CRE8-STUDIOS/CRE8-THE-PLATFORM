<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/** @type {{ children: import('svelte').Snippet }} */
	const { children } = $props()
</script>

<main id="content" class="centered-page">
	<div class="centered-page-inner">
		<a class="centered-page-logo" href="/"><Mascot size="4rem" /></a>
		{@render children()}
	</div>
</main>

<style>
	.centered-page {
		display: grid;
		place-items: center;
		min-block-size: 100dvh;
		padding: var(--space-xl) var(--space-m);
	}

	.centered-page-inner {
		display: grid;
		gap: var(--space-m);
		inline-size: min(100%, var(--size-narrow));
	}

	.centered-page-logo {
		display: flex;
		justify-self: center;
	}
</style>

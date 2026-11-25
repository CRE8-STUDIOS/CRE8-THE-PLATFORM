<script>
	/** @type {{ children: import('svelte').Snippet }} */
	const { children } = $props()
</script>

<main id="content" class="centered-page">
	<div class="centered-page-inner">
		<a class="centered-page-logo" href="/">CRE8</a>
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
		justify-self: center;
		font-family: var(--font-family-display);
		font-size: var(--font-size-project);
		letter-spacing: var(--letter-spacing-display);
		text-decoration: none;
	}
</style>

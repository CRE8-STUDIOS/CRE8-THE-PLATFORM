<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/** @type {{ title: string, intro?: string, children: import('svelte').Snippet, bottom?: import('svelte').Snippet, after?: import('svelte').Snippet }} */
	const { title, intro, children, bottom, after } = $props()
</script>

<main id="content" class="auth-page">
	<h1 class="auth-heading">Welcome to<br />CRE8 the platform</h1>

	<div class="auth-stage">
		<div class="auth-mascot" aria-hidden="true">
			<Mascot size="var(--auth-mascot-size)" follow />
		</div>

		<section class="auth-card" class:auth-card-split={bottom} aria-labelledby="auth-card-title">
			<div class="auth-card-shape" aria-hidden="true"></div>
			<div class="auth-card-half">
				<h2 id="auth-card-title" class="auth-card-title">{title}</h2>
				{#if intro}<p class="auth-card-intro">{intro}</p>{/if}
				{@render children()}
			</div>
			{#if bottom}<div class="auth-card-half">{@render bottom()}</div>{/if}
		</section>
	</div>

	{#if after}<div class="auth-after">{@render after()}</div>{/if}
</main>

<style>
	.auth-page {
		--auth-mascot-size: clamp(24rem, 14rem + 30vw, 46rem);
		--auth-notch: clamp(1.75rem, 1rem + 3.5vw, 3.5rem);
		--auth-notch-depth: calc(var(--auth-notch) * 1.6);

		display: grid;
		justify-items: center;
		align-content: start;
		gap: var(--space-m);
		min-block-size: 100dvh;
		padding: var(--space-m) var(--space-m) var(--space-xl);
		overflow-x: clip;
		background-color: var(--color-background);
		text-align: center;
	}

	.auth-heading {
		font-size: var(--font-size-page-heading);
	}

	.auth-stage {
		position: relative;
		inline-size: min(100%, var(--size-auth-card));
		margin-block-start: calc(var(--auth-mascot-size) * -0.09);
		padding-block-start: calc(var(--auth-mascot-size) * 0.58);
	}

	.auth-mascot {
		position: absolute;
		inset-block-start: 0;
		inset-inline: 0;
		z-index: 0;
		display: flex;
		justify-content: center;
	}

	.auth-mascot :global(.mascot) {
		flex-shrink: 0;
		max-inline-size: none;
		animation: none;
	}

	.auth-card {
		--focus-outline: var(--border-width-thick) solid var(--color-auth-card-text);

		position: relative;
		z-index: 1;
		isolation: isolate;
		display: grid;
		padding-block: var(--space-xl);
		padding-inline: calc(var(--auth-notch-depth) + var(--space-s));
		color: var(--color-auth-card-text);
	}

	.auth-card-half {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: var(--space-s);
	}

	.auth-card-split {
		grid-template-rows: 1fr 1fr;
		row-gap: var(--space-l);
	}

	.auth-card-split .auth-card-half:first-of-type {
		align-content: end;
	}

	.auth-card-split .auth-card-half:last-of-type {
		align-content: start;
	}

	.auth-card-shape {
		position: absolute;
		inset: 0;
		z-index: -1;
		filter: var(--rough-edge);
	}

	.auth-card-shape::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius-card);
		background-color: var(--color-auth-card);
		clip-path: polygon(
			0 0,
			100% 0,
			100% calc(50% - var(--auth-notch)),
			calc(100% - var(--auth-notch-depth)) 50%,
			100% calc(50% + var(--auth-notch)),
			100% 100%,
			0 100%,
			0 calc(50% + var(--auth-notch)),
			var(--auth-notch-depth) 50%,
			0 calc(50% - var(--auth-notch))
		);
	}

	.auth-card-title {
		font-size: var(--font-size-project);
	}

	.auth-card-intro {
		margin-block-start: calc(var(--space-s) * -1 + var(--space-2xs));
		font-size: var(--font-size-small);
	}

	.auth-card :global(.auth-message) {
		font-size: var(--font-size-small);
	}

	.auth-card :global(a:not(.button)) {
		color: inherit;
	}

	.auth-after {
		font-size: var(--font-size-small);
	}

	.auth-after :global(a) {
		color: inherit;
	}
</style>

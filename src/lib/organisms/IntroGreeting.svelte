<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ partOfDay: string, firstName: string | null }} */
	const { partOfDay, firstName } = $props()
</script>

<section class="intro" aria-labelledby="intro-title">
	<h1 id="intro-title" class="intro-title">
		{partOfDay}{#if firstName},<br />{firstName}{/if}
	</h1>

	<Mascot size="10rem" />

	<p class="intro-small">are you ready for today!</p>
	<p>Do you want me to walk you through it?</p>

	<div class="intro-actions">
		<a class="button button-primary" href="?step=planning">Yes</a>
		<ActionButton
			action="/clock?/in"
			label="No"
			variant="muted"
			fields={{ redirectTo: '/overview' }}
		/>
	</div>
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

	.intro-small {
		color: var(--color-text-muted);
		font-size: var(--font-size-small);
	}

	.intro-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-xs);
	}
</style>

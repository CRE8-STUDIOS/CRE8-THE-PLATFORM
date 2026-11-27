<script>
	import Mascot from '#lib/atoms/Mascot.svelte'

	/** @type {{ sentence: string }} */
	const { sentence } = $props()
</script>

<div class="add-sentence">
	<span aria-hidden="true"><Mascot size="2rem" animate={false} /></span>
	<p aria-live="polite">{sentence}</p>
</div>

<style>
	.add-sentence {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		min-block-size: 2.5rem;
	}

	p {
		font-size: var(--font-size-agenda-meta);
		font-weight: 600;
		line-height: 1.45;
	}
</style>

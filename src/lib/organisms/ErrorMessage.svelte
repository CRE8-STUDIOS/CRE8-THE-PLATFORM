<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ status: number, message: string }} */
	const { status, message } = $props()
</script>

<section class="error-message">
	<Heading level={1}>{status}</Heading>
	<p>{message}</p>
	<p><a class="button button-primary" href="/">Back to CRE8</a></p>
</section>

<style>
	.error-message {
		display: grid;
		justify-items: center;
		gap: var(--space-m);
		text-align: center;
	}
</style>

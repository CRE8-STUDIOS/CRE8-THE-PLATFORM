<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ status: number, message: string }} */
	const { status, message } = $props()
</script>

<section class="error-message">
	<Heading level={1}>{status}</Heading>
	<p>{message}</p>
	<p><a href="/">Back to CRE8</a></p>
</section>

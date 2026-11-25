<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'

	/** @type {{ contract: { title: string, body: string, signed_at: string | null, signed_ip: unknown, signature_data: string | null }, timeZone?: string, projectId?: string }} */
	const { contract, timeZone, projectId } = $props()
	const signatureSource = $derived(
		contract.signature_data
			? `data:image/svg+xml;utf8,${encodeURIComponent(contract.signature_data)}`
			: null
	)
</script>

<article class="signed-contract">
	<Heading>{contract.title}</Heading>
	<p>
		Signed <DateTime value={contract.signed_at} {timeZone} />{#if contract.signed_ip}
			(IP {contract.signed_ip}){/if}. This contract is locked.
	</p>
	<pre class="signed-contract-body">{contract.body}</pre>
	{#if signatureSource}
		<img src={signatureSource} alt="Signature of the client" width="300" />
	{/if}
	{#if projectId}
		<p>Extra work? Add it as a <a href="/projects/{projectId}/requests">request</a>.</p>
	{/if}
</article>

<style>
	.signed-contract-body {
		white-space: pre-wrap;
	}
</style>

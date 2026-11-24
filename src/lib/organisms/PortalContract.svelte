<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import SignatureField from '#lib/molecules/SignatureField.svelte'
	import SignedContract from '#lib/organisms/SignedContract.svelte'

	/**
	 * The contract in the portal: read it and sign it with a drawn signature.
	 * @type {{ contract: { id: string, title: string, body: string, status: string, signed_at: string | null, signed_ip: unknown, signature_data: string | null } | null }}
	 */
	const { contract } = $props()
</script>

<section class="portal-contract">
	{#if !contract}
		<Heading>Contract</Heading>
		<p>No contract has been sent yet.</p>
	{:else if contract.status === 'signed'}
		<SignedContract {contract} />
	{:else}
		<Heading>{contract.title}</Heading>
		<pre class="portal-contract-body">{contract.body}</pre>
		<form method="POST" action="?/signContract">
			<Input type="hidden" name="contract_id" value={contract.id} />
			<SignatureField label="Draw your signature to agree" />
			<Button variant="primary">Sign contract</Button>
		</form>
	{/if}
</section>

<style>
	.portal-contract-body {
		white-space: pre-wrap;
	}
</style>

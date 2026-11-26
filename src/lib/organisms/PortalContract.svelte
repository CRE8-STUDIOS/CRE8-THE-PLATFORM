<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import SignatureField from '#lib/molecules/SignatureField.svelte'
	import SignedContract from '#lib/organisms/SignedContract.svelte'

	/** @type {{ contract: { id: string, title: string, body: string, status: string, signed_at: string | null, signed_ip: unknown, signature_data: string | null } | null }} */
	const { contract } = $props()
</script>

<section
	class="portal-contract card rough-edge span-full"
	class:card-highlight={contract && contract.status !== 'signed'}
>
	{#if !contract}
		<Heading>Contract</Heading>
		<p>No contract has been sent yet.</p>
	{:else if contract.status === 'signed'}
		<SignedContract {contract} />
	{:else}
		<p class="label text-muted">Contract to sign</p>
		<Heading>{contract.title}</Heading>
		<pre class="portal-contract-body">{contract.body}</pre>
		<form class="portal-contract-sign" method="POST" action="?/signContract">
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

	.portal-contract-sign {
		display: grid;
		gap: var(--space-s);
		justify-items: start;
	}
</style>

<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ clients: { id: string, name: string, company: string | null, email: string | null }[], showArchived: boolean }} */
	const { clients, showArchived } = $props()
</script>

<section class="client-list card rough-edge">
	<Heading>{showArchived ? 'Archived clients' : 'Active clients'}</Heading>
	<p>
		{#if showArchived}<a class="pill-link" href="/clients">Show active clients</a>{:else}<a
				class="pill-link"
				href="/clients?archived=1"
			>
				Show archived clients
			</a>{/if}
	</p>
	<ul>
		{#each clients as { id, name, company, email } (id)}
			<li>
				<span class="avatar" aria-hidden="true">{name.charAt(0)}</span>
				<span class="client-list-text">
					<a href="/clients/{id}">{name}</a>
					{#if company || email}<span class="text-small text-muted">
							{[company, email].filter(Boolean).join(' · ')}
						</span>{/if}
				</span>
			</li>
		{:else}
			<li class="text-muted">No clients here.</li>
		{/each}
	</ul>
</section>

<style>
	.client-list-text {
		display: grid;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}
</style>

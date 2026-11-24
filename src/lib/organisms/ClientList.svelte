<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ clients: { id: string, name: string, company: string | null, email: string | null }[], showArchived: boolean }} */
	const { clients, showArchived } = $props()
</script>

<section class="client-list">
	<Heading>{showArchived ? 'Archived clients' : 'Active clients'}</Heading>
	<p>
		{#if showArchived}<a href="/clients">Show active clients</a>{:else}<a
				href="/clients?archived=1"
			>
				Show archived clients
			</a>{/if}
	</p>
	<ul>
		{#each clients as { id, name, company, email } (id)}
			<li>
				<a href="/clients/{id}">{name}</a>{#if company}
					· {company}{/if}{#if email}
					· {email}{/if}
			</li>
		{:else}
			<li>No clients here.</li>
		{/each}
	</ul>
</section>

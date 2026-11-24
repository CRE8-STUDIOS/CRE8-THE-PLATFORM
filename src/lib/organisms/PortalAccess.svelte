<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * @type {{
	 *   access: { id: string, invited_email: string, accepted_at: string | null, last_seen_at: string | null }[],
	 *   signupLink: string, clientEmail: string, timeZone: string
	 * }}
	 */
	const { access, signupLink, clientEmail, timeZone } = $props()
</script>

<section class="portal-access">
	<Heading>Client portal access</Heading>
	<p>
		Invited clients see this project's title, dates, briefing, visible updates, shared files,
		visible moodboards, and the contract, requests and facturen once you send them. Never your
		hours, notes, expenses or price.
	</p>
	<ul>
		{#each access as { id, invited_email, accepted_at, last_seen_at } (id)}
			<li>
				{invited_email} ·
				{#if accepted_at}joined <DateTime value={accepted_at} {timeZone} />{:else}invited, not
					joined yet{/if}
				{#if last_seen_at}· last seen <DateTime value={last_seen_at} {timeZone} />{/if}
				<ActionButton action="?/remove" label="Remove access" variant="danger" fields={{ id }} />
			</li>
		{:else}
			<li>Nobody invited yet.</li>
		{/each}
	</ul>

	<Heading level={3}>Invite</Heading>
	<form method="POST" action="?/invite">
		<TextField label="Client email" name="email" type="email" value={clientEmail} required />
		<Button variant="primary">Invite</Button>
	</form>
	<p>
		Invitation emails come later. For now, send your client this signup link: <a href={signupLink}>
			{signupLink}
		</a>
	</p>
</section>

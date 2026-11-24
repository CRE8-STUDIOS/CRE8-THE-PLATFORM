<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * People on an agenda item: people on set, meeting attendees.
	 * @type {{ people: { id: string, name: string, role: string | null, email: string | null, phone: string | null }[] }}
	 */
	const { people } = $props()
</script>

<section class="people-list">
	<Heading>People</Heading>
	<ul>
		{#each people as { id, name, role, email, phone } (id)}
			<li>
				{name}{#if role}
					· {role}{/if}{#if email}
					· <a href="mailto:{email}">{email}</a>{/if}{#if phone}
					· <a href="tel:{phone}">{phone}</a>{/if}
				<ActionButton action="?/deletePerson" label="Remove" fields={{ id }} />
			</li>
		{:else}
			<li>Nobody added yet.</li>
		{/each}
	</ul>
	<form method="POST" action="?/addPerson">
		<TextField label="Name" name="name" required />
		<TextField label="Role" name="role" placeholder="e.g. MUA, photographer" />
		<TextField label="Email" name="email" type="email" />
		<TextField label="Phone" name="phone" type="tel" />
		<Button>Add person</Button>
	</form>
</section>

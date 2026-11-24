<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * Tasks and errands without a time yet. "Plan" gives them a time in the week.
	 * @type {{ items: { id: string, type: string, title: string, due_date: string | null, status: string, estimated_minutes: number | null, projects: { title: string } | null }[] }}
	 */
	const { items } = $props()
</script>

<section class="agenda-inbox">
	<Heading>Inbox (not planned yet)</Heading>
	<ul>
		{#each items as { id, type, title, due_date, status, estimated_minutes, projects } (id)}
			<li>
				{type} · <a href="/agenda/{id}">{title}</a>
				{#if projects}· {projects.title}{/if}
				{#if due_date}· due {due_date}{/if}
				<form method="POST" action="?/schedule">
					<Input type="hidden" name="id" value={id} />
					<Input type="hidden" name="minutes" value={estimated_minutes ?? 60} />
					<TextField label="Plan at" type="datetime-local" name="starts_at" required />
					<Button>Plan</Button>
				</form>
				<ActionButton action="?/toggleDone" label="Mark done" fields={{ id, status }} />
			</li>
		{:else}
			<li>Inbox is empty.</li>
		{/each}
	</ul>
</section>

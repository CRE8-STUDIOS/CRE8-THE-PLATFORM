<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ items: { id: string, type: string, title: string, due_date: string | null, status: string, estimated_minutes: number | null, projects: { title: string } | null }[] }} */
	const { items } = $props()
</script>

<section class="agenda-inbox card rough-edge">
	<Heading>Inbox (not planned yet)</Heading>
	<ul>
		{#each items as { id, type, title, due_date, status, estimated_minutes, projects } (id)}
			<li>
				<span class="agenda-inbox-text">
					<a href="/agenda/{id}">{title}</a>
					<span class="text-small text-muted">
						{type}{#if projects}
							· {projects.title}{/if}{#if due_date}
							· due {due_date}{/if}
					</span>
				</span>
				<form class="agenda-inbox-plan" method="POST" action="?/schedule">
					<Input type="hidden" name="id" value={id} />
					<Input type="hidden" name="minutes" value={estimated_minutes ?? 60} />
					<TextField label="Plan at" type="datetime-local" name="starts_at" required />
					<Button>Plan</Button>
				</form>
				<ActionButton action="?/toggleDone" label="Mark done" fields={{ id, status }} />
			</li>
		{:else}
			<li class="text-muted">Inbox is empty.</li>
		{/each}
	</ul>
</section>

<style>
	.agenda-inbox-text {
		display: grid;
		flex: 1 1 100%;
	}

	.agenda-inbox-plan {
		flex: 1 1 auto;
	}
</style>

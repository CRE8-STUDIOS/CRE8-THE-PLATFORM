<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * Meeting requests from clients, waiting for your answer.
	 * @type {{ meetings: { id: string, starts_at: string, ends_at: string, message: string | null, projects: { title: string, clients: { name: string } | null } | null }[], timeZone: string }}
	 */
	const { meetings, timeZone } = $props()
</script>

{#if meetings.length}
	<section class="meeting-requests">
		<Heading>Meeting requests from clients</Heading>
		<ul>
			{#each meetings as { id, starts_at, ends_at, message, projects } (id)}
				<li>
					<DateTime value={starts_at} {timeZone} /> to <DateTime
						value={ends_at}
						{timeZone}
						show="time"
					/>
					· {projects?.clients?.name ?? 'Client'} · {projects?.title}
					{#if message}<blockquote>{message}</blockquote>{/if}
					<ActionButton
						action="?/answerMeeting"
						label="Accept"
						variant="primary"
						fields={{ id, accept: true }}
					/>
					<ActionButton action="?/answerMeeting" label="Decline" fields={{ id, accept: false }} />
				</li>
			{/each}
		</ul>
	</section>
{/if}

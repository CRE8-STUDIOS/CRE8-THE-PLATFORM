<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import DateTime from '#lib/atoms/DateTime.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * @type {{
	 *   monday: string, previousWeek: string, nextWeek: string, timeZone: string,
	 *   week: { date: string, label: string, items: { id: string, type: string, title: string, starts_at: string | null, ends_at: string | null, all_day: boolean, status: string, is_protected: boolean, projects: { title: string } | null }[] }[]
	 * }}
	 */
	const { monday, previousWeek, nextWeek, week, timeZone } = $props()
</script>

<section class="agenda-week">
	<Heading>Week of {monday}</Heading>
	<nav aria-label="Weeks">
		<a href="?week={previousWeek}">Previous week</a> · <a href="/agenda">This week</a> ·
		<a href="?week={nextWeek}">Next week</a>
	</nav>

	{#each week as { date, label, items } (date)}
		<Heading level={3}>{label}</Heading>
		<ul>
			{#each items as { id, type, title, starts_at, ends_at, all_day, status, is_protected, projects } (id)}
				<li>
					{#if all_day}All day{:else}<DateTime
							value={starts_at}
							{timeZone}
							show="time"
						/>{#if ends_at}
							to <DateTime value={ends_at} {timeZone} show="time" />{/if}{/if}
					· {type}{#if is_protected}
						(locked){/if} · <a href="/agenda/{id}">{title}</a>
					{#if projects}· {projects.title}{/if}
					{#if type === 'task' || type === 'errand'}
						<ActionButton
							action="?/toggleDone"
							label={status === 'done' ? 'Done' : 'Mark done'}
							fields={{ id, status }}
						/>
					{/if}
				</li>
			{:else}
				<li>Nothing planned.</li>
			{/each}
		</ul>
	{/each}
</section>

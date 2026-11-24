<script>
	import StatusLabel from '#lib/atoms/StatusLabel.svelte'

	/** @type {{ projects: { project_id: string, title: string, status: string, deadline: string | null, freelancer_name: string | null }[] }} */
	const { projects } = $props()
</script>

<section class="portal-project-list">
	<ul>
		{#each projects as { project_id, title, status, deadline, freelancer_name } (project_id)}
			<li>
				<a href="/portal/{project_id}">{title}</a>
				· with {freelancer_name ?? 'your freelancer'}
				<StatusLabel {status} />
				{#if deadline}· deadline {deadline}{/if}
			</li>
		{:else}
			<li>
				No projects yet. When a freelancer invites this email address, the project shows up here
				(make sure your email is confirmed).
			</li>
		{/each}
	</ul>
</section>

<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ projects: { id: string, title: string, client: string | null }[], choosing?: boolean }} */
	const { projects, choosing = false } = $props()
</script>

<section class="clock-in-prompt card rough-edge" aria-labelledby="clock-in-prompt-title">
	<Mascot size="4rem" />

	<div class="clock-in-prompt-body">
		{#if choosing && projects.length}
			<p id="clock-in-prompt-title" class="card-title">Which project are you working on?</p>
			<ul class="clock-in-prompt-projects">
				{#each projects as project (project.id)}
					<li>
						<form method="POST" action="/clock?/in">
							<Input type="hidden" name="project_id" value={project.id} />
							<Input type="hidden" name="redirectTo" value="/overview" />
							<Button variant="secondary" class="clock-in-prompt-project">
								<span>{project.title}</span>
								{#if project.client}<span class="text-small text-muted">{project.client}</span>{/if}
							</Button>
						</form>
					</li>
				{/each}
			</ul>
			<ActionButton
				action="/clock?/in"
				label="Not on a project"
				variant="text"
				fields={{ redirectTo: '/overview' }}
			/>
		{:else}
			<p id="clock-in-prompt-title" class="card-title">Do you want to clock in now?</p>
			<div class="button-group">
				{#if projects.length}
					<a class="button button-primary" href="?clock=choose">Yes</a>
				{:else}
					<ActionButton
						action="/clock?/in"
						label="Yes"
						variant="primary"
						fields={{ redirectTo: '/overview' }}
					/>
				{/if}
				<ActionButton action="?/later" label="Later" variant="muted" />
			</div>
		{/if}
	</div>
</section>

<style>
	.clock-in-prompt {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-m);
	}

	.clock-in-prompt-body {
		display: grid;
		flex: 1;
		justify-items: start;
		gap: var(--space-s);
	}

	.clock-in-prompt-projects {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		padding: 0;
		list-style: none;
	}

	.clock-in-prompt-projects :global(.clock-in-prompt-project) {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2xs);
		white-space: normal;
		text-align: start;
	}
</style>

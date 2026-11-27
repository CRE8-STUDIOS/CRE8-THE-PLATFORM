<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/**
	 * The once a day clock in question and its project choice. In switch
	 * mode it is the same choice, to move the running clock to another
	 * project, with a way to cancel.
	 * @type {{ projects: { id: string, title: string, client: string | null }[], choosing?: boolean, switching?: boolean }}
	 */
	const { projects, choosing = false, switching = false } = $props()
	const action = $derived(switching ? '/clock?/switch' : '/clock?/in')

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state()
	let modal = $state(false)

	const focusFirstButton = () => {
		;/** @type {HTMLElement | null | undefined} */ (
			dialog?.querySelector('button, a.button')
		)?.focus()
	}

	const keepOpen = () => {
		if (dialog && !dialog.open) dialog.showModal()
	}

	$effect(() => {
		if (!dialog) return
		if (dialog.open) dialog.close()
		dialog.showModal()
		modal = true
		focusFirstButton()
		dialog.addEventListener('close', keepOpen)
		return () => dialog?.removeEventListener('close', keepOpen)
	})

	$effect(() => {
		if (modal && choosing) focusFirstButton()
	})
</script>

<dialog
	bind:this={dialog}
	class="clock-in-prompt"
	class:clock-in-prompt-modal={modal}
	open
	closedby="none"
	aria-labelledby="clock-in-prompt-title"
	oncancel={(event) => event.preventDefault()}
>
	<div class="clock-in-prompt-panel card rough-edge">
		<Mascot size="6rem" />

		{#if (choosing || switching) && projects.length}
			<p id="clock-in-prompt-title" class="card-title">
				{switching ? 'Switch to which project?' : 'Which project are you working on?'}
			</p>
			<ul class="clock-in-prompt-projects">
				{#each projects as project (project.id)}
					<li>
						<form method="POST" {action}>
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
				{action}
				label="Not on a project"
				variant="text"
				fields={{ redirectTo: '/overview' }}
			/>
			{#if switching}<a class="button button-muted" href="/overview">Cancel</a>{/if}
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
</dialog>

<style>
	.clock-in-prompt {
		max-inline-size: min(100% - 2 * var(--space-m), var(--size-narrow));
		max-block-size: calc(100% - 2 * var(--space-m));
		margin: auto;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		overflow: visible;
	}

	.clock-in-prompt::backdrop {
		background-color: var(--color-backdrop);
		backdrop-filter: blur(var(--backdrop-blur));
	}

	.clock-in-prompt:not(.clock-in-prompt-modal) {
		position: fixed;
		inset: 0;
		z-index: var(--layer-modal);
		display: grid;
		place-items: center;
		inline-size: 100%;
		max-inline-size: none;
		block-size: 100%;
		max-block-size: none;
		margin: 0;
		padding: var(--space-m);
		background-color: var(--color-backdrop);
		backdrop-filter: blur(var(--backdrop-blur));
	}

	.clock-in-prompt-panel {
		display: grid;
		justify-items: center;
		gap: var(--space-m);
		inline-size: min(100%, var(--size-narrow));
		max-block-size: 100%;
		padding: var(--space-l);
		overflow-y: auto;
		text-align: center;
	}

	.clock-in-prompt-projects {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-xs);
		padding: 0;
		list-style: none;
	}

	.clock-in-prompt-projects :global(.clock-in-prompt-project) {
		flex-direction: column;
		gap: var(--space-2xs);
		white-space: normal;
	}
</style>

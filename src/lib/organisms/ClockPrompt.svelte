<script>
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'

	/** @type {{ projectId: string, projectTitle: string, mode: string, running: boolean, current: string }} */
	const { projectId, projectTitle, mode, running, current } = $props()

	let dismissed = $state(false)
	/** @type {HTMLFormElement | undefined} */
	let form = $state()
	let autoSent = false

	$effect(() => {
		if (mode === 'auto' && !running && form && !autoSent) {
			autoSent = true
			form.requestSubmit()
		}
	})
</script>

{#if !running && mode !== 'off' && !dismissed}
	<section class="clock-prompt" aria-label="Clock in" hidden={mode === 'auto'}>
		<form method="POST" action="/clock?/in" bind:this={form}>
			<Input type="hidden" name="project_id" value={projectId} />
			<Input type="hidden" name="started_by" value={mode === 'auto' ? 'auto' : 'prompt'} />
			<Input type="hidden" name="redirectTo" value={current} />
			<p>Clock in for {projectTitle}?</p>
			<Button variant="primary">Yes, clock in</Button>
			<Button type="button" onclick={() => (dismissed = true)}>Not now</Button>
		</form>
	</section>
{/if}

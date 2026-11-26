<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ projects: { id: string, title: string, client: string | null }[] }} */
	const { projects } = $props()
</script>

<section class="clock-in-prompt card rough-edge" aria-labelledby="clock-in-prompt-title">
	<Mascot size="4rem" />

	<div class="clock-in-prompt-body">
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
		gap: var(--space-s);
	}
</style>

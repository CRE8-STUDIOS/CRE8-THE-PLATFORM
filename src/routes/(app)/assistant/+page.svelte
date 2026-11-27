<script>
	import Onboarding from '#lib/organisms/onboarding/Onboarding.svelte'
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'
	import StatCard from '#lib/molecules/StatCard.svelte'

	const stats = [
		{ label: '[Stat label]', value: '[Number]', note: '[Short explanation]' },
		{ label: '[Stat label]', value: '[Number]', note: '[Short explanation]' },
		{ label: '[Stat label]', value: '[Number]', note: '[Short explanation]' }
	]
	const projects = [
		{ name: '[Project name]', advice: '[Advice for this project]' },
		{ name: '[Project name]', advice: '[Advice for this project]' }
	]

	const { data, form } = $props()
</script>

{#if data.onboarding}
	<Onboarding {...data.onboarding} {form} />
{:else}
	<!-- Placeholder page: the data is connected later. -->
	<PageHeader title="Assistant" tag="V2" />

	<Card title="Advice" label="This week" highlight>
		<p>[Advice based on your hours, deadlines and facturen.]</p>
	</Card>

	<div class="card-grid stat-grid">
		{#each stats as stat, index (index)}
			<StatCard {...stat} />
		{/each}
	</div>

	<Card title="Per project">
		<ul class="card-list">
			{#each projects as { name, advice }, index (index)}
				<li>
					<span class="card-title">{name}</span>
					<span class="list-end text-muted">{advice}</span>
				</li>
			{/each}
		</ul>
	</Card>

	<form class="assistant-ask card rough-edge">
		<label class="field assistant-field">
			<span class="field-label">Ask the assistant</span>
			<input name="question" placeholder="[Ask something about your work]" disabled />
		</label>
		<button class="button button-primary" type="submit" disabled>Send</button>
	</form>
{/if}

<style>
	.stat-grid {
		--grid-min: var(--size-grid-s);
	}

	.assistant-ask {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		gap: var(--space-s);
	}

	.assistant-ask > * + * {
		margin-block-start: 0;
	}

	.assistant-field {
		flex: 1 1 var(--size-grid-m);
	}
</style>

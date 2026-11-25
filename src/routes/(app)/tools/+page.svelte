<!-- Placeholder page: the data is connected later. -->
<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'

	const tools = [
		{ name: '[Tool name]', description: '[Short description of what this tool does]' },
		{ name: '[Tool name]', description: '[Short description of what this tool does]' },
		{ name: '[Tool name]', description: '[Short description of what this tool does]', tag: 'V2' }
	]
	const recent = [
		{ title: '[Document title]', project: '[Project name]', edited: '[Edited date]' },
		{ title: '[Document title]', project: '[Project name]', edited: '[Edited date]' }
	]
</script>

<PageHeader title="Tools" intro="[One line about what you find in your tools]" />

<ul class="card-grid tool-grid">
	{#each tools as { name, description, tag }, index (index)}
		<li class="card rough-edge">
			<p class="card-title">
				{name}{#if tag}<span class="version-tag tool-tag">{tag}</span>{/if}
			</p>
			<p class="text-muted">{description}</p>
		</li>
	{/each}
</ul>

<Card title="Recent">
	<ul class="card-list">
		{#each recent as { title, project, edited }, index (index)}
			<li>
				<span class="recent-title">{title}</span>
				<span class="text-muted">{project}</span>
				<span class="list-end text-small text-muted">{edited}</span>
			</li>
		{/each}
	</ul>
</Card>

<style>
	.tool-grid {
		--grid-min: var(--size-grid-m);
		padding: 0;
		list-style: none;
	}

	.tool-tag {
		margin-inline-start: var(--space-xs);
	}

	.recent-title {
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}
</style>

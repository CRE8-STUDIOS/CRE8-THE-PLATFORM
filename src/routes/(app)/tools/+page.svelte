<!-- Placeholder page: the [placeholder] tools and the recent list are connected later. -->
<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'

	/** @type {{ name: string, description: string, href?: string, tag?: string }[]} */
	const tools = [
		{
			name: 'Moodboards',
			description: 'Collect images, colours and references per project.',
			href: '/moodboards'
		},
		{ name: 'Notes', description: 'Private notes, loose or linked to a project.', href: '/notes' },
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
	{#each tools as { name, description, href, tag }, index (index)}
		<li class="tool-card card rough-edge">
			<p class="card-title">
				{#if href}<a class="tool-link" {href}>{name}</a>{:else}{name}{/if}{#if tag}<span
						class="version-tag tool-tag"
					>
						{tag}
					</span>{/if}
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

	.tool-card {
		position: relative;
	}

	.tool-link {
		text-decoration: none;
	}

	.tool-link::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.tool-card:hover .tool-link {
		text-decoration-line: underline;
	}

	.tool-card:focus-within {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
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

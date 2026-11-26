<!-- Placeholder page: the data is connected later. -->
<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'
	import AppTile from '#lib/molecules/AppTile.svelte'

	const quickActions = [
		{ href: '/projects#new-project', text: '+ New project' },
		{ href: '/finance#new-factuur', text: '+ New factuur' },
		{ href: '/projects', text: '+ New request' },
		{ href: '/notes#new-note', text: '+ New note' }
	]
	const apps = ['[App name]', '[App name]', '[App name]', '[App name]']
</script>

<PageHeader title="Workspace">
	{#snippet actions()}
		<form class="workspace-search" role="search">
			<label class="field">
				<span class="visually-hidden">Search your workspace</span>
				<input type="search" name="q" placeholder="Search [projects, notes, files]" />
			</label>
		</form>
	{/snippet}
</PageHeader>

<nav aria-label="Quick actions">
	<ul class="pill-list">
		{#each quickActions as { href, text } (text)}
			<li><a class="pill-link" {href}>{text}</a></li>
		{/each}
	</ul>
</nav>

<Card title="My apps">
	<ul class="app-grid">
		{#each apps as name, index (index)}
			<li><AppTile {name} /></li>
		{/each}
		<li>
			<a class="app-grid-add" href="/settings/tiles">
				<span class="app-grid-add-icon" aria-hidden="true">+</span>
				Add app
			</a>
		</li>
	</ul>
</Card>

<style>
	.workspace-search {
		inline-size: min(100%, var(--size-grid-2xl));
	}

	.app-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--size-grid-tile), 1fr));
		gap: var(--space-s);
		padding: 0;
		list-style: none;
	}

	.app-grid-add {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: var(--space-xs);
		block-size: 100%;
		padding: var(--space-m);
		border: var(--border-width-thick) dashed var(--color-border);
		border-radius: var(--radius-card);
		color: var(--color-text-muted);
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
		text-decoration: none;
	}

	.app-grid-add:hover {
		border-color: var(--color-text);
		color: var(--color-text);
	}

	.app-grid-add-icon {
		font-size: var(--font-size-project);
		line-height: var(--line-height-tight);
	}
</style>

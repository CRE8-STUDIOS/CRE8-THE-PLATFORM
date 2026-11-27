<script>
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import ToolCard from '#lib/molecules/ToolCard.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Workspace · CRE8</title></svelte:head>

<div class="workspace">
	<div class="workspace-heading">
		<h1>Workspace</h1>
	</div>

	<CalmSection id="tools-heading" heading="Tools">
		<ul class="workspace-tools">
			{#each data.tools as tool (tool.name)}
				<li><ToolCard {...tool} /></li>
			{/each}
		</ul>
	</CalmSection>
</div>

<style>
	.workspace {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		max-inline-size: var(--agenda-max-width);
	}

	.workspace-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-m);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.workspace-tools {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: var(--space-m);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.workspace-tools li {
		display: grid;
	}
</style>

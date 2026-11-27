<script>
	import Mascot from '#lib/atoms/Mascot.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'

	/**
	 * The first time there are no apps: no placeholder tiles, one dashed box.
	 * @type {{ href: string, onclick?: (event: MouseEvent) => void }}
	 */
	const { href, onclick } = $props()
</script>

<div class="workspace-empty">
	<span class="workspace-empty-face" aria-hidden="true">
		<Mascot size="4rem" animate={false} />
	</span>
	<div class="workspace-empty-text">
		<p class="workspace-empty-title">No apps yet</p>
		<p>
			Put the apps you use every day here, like your mail, Instagram, Figma or your bank. One click
			and you are there.
		</p>
	</div>
	<OutlineButton {href} strong {onclick}>Add your first app</OutlineButton>
</div>

<style>
	.workspace-empty {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-l);
		padding: var(--space-xl);
		border: var(--line-dashed);
		border-radius: 1.25rem;
	}

	.workspace-empty-face {
		display: flex;
	}

	.workspace-empty-text {
		display: flex;
		flex: 1 1 16rem;
		flex-direction: column;
		gap: var(--space-xs);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.workspace-empty-title {
		color: var(--color-text);
		font-size: 1.125rem;
		font-weight: 800;
		text-transform: uppercase;
	}
</style>

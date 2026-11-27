<script>
	/**
	 * Step 1: what do you want to add.
	 * @type {{ hrefFor: (type: string) => string, closeHref: string, onchoose?: (event: MouseEvent, type: string) => void, onclose?: (event: MouseEvent) => void }}
	 */
	const { hrefFor, closeHref, onchoose, onclose } = $props()

	const CHOICES = [
		{ type: 'task', label: 'Task', line: 'Something you need to do. With or without a time.' },
		{
			type: 'meeting',
			label: 'Meeting',
			line: 'With a client or anyone else, in person or online.'
		},
		{
			type: 'work',
			label: 'Work block',
			line: 'Time to focus on a project. Clients cannot book over it.'
		},
		{
			type: 'errand',
			label: 'Errand',
			line: 'Something to pick up or drop off, when the place is open.'
		},
		{ type: 'deadline', label: 'Deadline', line: 'A date something has to be finished.' },
		{ type: 'rest', label: 'Rest', line: 'Lunch, a break or a day off. Rest counts too.' }
	]
</script>

<div class="chooser">
	<div class="chooser-top">
		<a class="chooser-close" href={closeHref} aria-label="Close" onclick={onclose}>
			<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1 1 11" /></svg>
		</a>
	</div>
	<h1 class="chooser-heading">What do you want to add?</h1>
	<nav class="chooser-list" aria-label="Choose what to add">
		{#each CHOICES as choice (choice.type)}
			<a href={hrefFor(choice.type)} onclick={(event) => onchoose?.(event, choice.type)}>
				<span class="chooser-label">{choice.label}</span>
				<span class="chooser-line">{choice.line}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	.chooser {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
	}

	.chooser-top {
		display: flex;
		justify-content: flex-end;
	}

	.chooser-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: var(--size-touch);
		block-size: var(--size-touch);
		border: var(--line);
		border-radius: var(--radius-pill);
		color: var(--color-text);
	}

	.chooser-close svg {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}

	.chooser-heading {
		font-size: clamp(1.375rem, 1.2rem + 0.8vw, 1.625rem);
		line-height: 1.15;
		text-transform: uppercase;
	}

	.chooser-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.chooser-list a {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding: var(--space-s) var(--space-m);
		border: var(--line);
		border-radius: var(--radius-item);
		color: var(--color-text);
		text-decoration: none;
	}

	.chooser-list a:hover .chooser-label {
		text-decoration: underline;
	}

	.chooser-label {
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
	}

	.chooser-line {
		color: var(--color-text-calm);
		font-size: var(--font-size-label);
		line-height: 1.45;
	}
</style>

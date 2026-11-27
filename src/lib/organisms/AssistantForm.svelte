<script>
	import { untrack } from 'svelte'
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Mascot from '#lib/atoms/Mascot.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'
	import {
		ASSISTANT_COLORS,
		ASSISTANT_DEFAULT_NAME,
		ASSISTANT_NAME_MAX,
		ASSISTANT_SHAPES
	} from '#lib/utils/constants.js'

	/** @type {{ assistant: { name: string | null, color: string, shape: string, matchWorkspace: boolean } }} */
	const { assistant } = $props()

	let name = $state(untrack(() => assistant.name ?? ''))
	let color = $state(untrack(() => assistant.color))
	let shape = $state(untrack(() => assistant.shape))
</script>

<section class="assistant-form card rough-edge">
	<Heading>Assistant</Heading>
	<form method="POST" action="?/assistant">
		<div class="assistant-preview" data-assistant-color={color} aria-hidden="true">
			<Mascot size="8rem" {shape} />
			<p class="assistant-preview-name">{name.trim() || ASSISTANT_DEFAULT_NAME}</p>
		</div>

		<TextField
			label="Name"
			name="assistant_name"
			value={assistant.name ?? ''}
			maxlength={ASSISTANT_NAME_MAX}
			autocomplete="off"
			placeholder={ASSISTANT_DEFAULT_NAME}
			hint="Leave empty and it stays {ASSISTANT_DEFAULT_NAME}"
			oninput={(/** @type {Event & { currentTarget: HTMLInputElement }} */ event) =>
				(name = event.currentTarget.value)}
		/>

		<fieldset class="assistant-options">
			<legend>Colour</legend>
			{#each ASSISTANT_COLORS as option (option)}
				<label class="assistant-option">
					<input
						class="visually-hidden"
						type="radio"
						name="assistant_color"
						value={option}
						bind:group={color}
					/>
					<span class="assistant-swatch" data-assistant-color={option}></span>
					<span class="assistant-option-name">{option}</span>
				</label>
			{/each}
		</fieldset>

		<fieldset class="assistant-options">
			<legend>Shape</legend>
			{#each ASSISTANT_SHAPES as option (option)}
				<label class="assistant-option">
					<input
						class="visually-hidden"
						type="radio"
						name="assistant_shape"
						value={option}
						bind:group={shape}
					/>
					<span data-assistant-color={color} aria-hidden="true">
						<Mascot size="2.5rem" shape={option} animate={false} />
					</span>
					<span class="assistant-option-name">{option}</span>
				</label>
			{/each}
		</fieldset>

		<CheckboxField
			label="Match my workspace to my assistant"
			name="workspace_matches_assistant"
			checked={assistant.matchWorkspace}
		/>

		<Button variant="primary">Save</Button>
	</form>
</section>

<style>
	.assistant-preview {
		display: grid;
		grid-column: 1 / -1;
		justify-items: center;
		gap: var(--space-xs);
		padding-block: var(--space-s);
	}

	.assistant-preview-name {
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	.assistant-options {
		grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
	}

	.assistant-option {
		display: grid;
		justify-items: center;
		align-content: start;
		gap: var(--space-2xs);
		min-block-size: 2.75rem;
		padding: var(--space-xs);
		border: var(--border-width-thick) solid transparent;
		border-radius: var(--radius-small);
		cursor: pointer;
	}

	.assistant-option:has(input:checked) {
		border-color: var(--color-text);
	}

	.assistant-option:has(input:focus-visible) {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}

	.assistant-swatch {
		inline-size: 2.5rem;
		block-size: 2.5rem;
		border-radius: 50%;
		background-color: var(--mascot-color);
	}

	.assistant-option-name {
		font-size: var(--font-size-small);
		text-transform: capitalize;
	}
</style>

<script>
	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import CalmField from '#lib/molecules/CalmField.svelte'
	import WorkspaceTile from '#lib/molecules/WorkspaceTile.svelte'
	import { ICON_ACCEPT, iconError, initialOf } from '#lib/workspace/tiles.js'

	/**
	 * Add or change an app or a link. Apps get an optional icon and a live
	 * preview of the tile.
	 * @type {{
	 *   kind: 'app' | 'link',
	 *   heading: string,
	 *   submitLabel: string,
	 *   action: string,
	 *   answers?: { name: string, url: string },
	 *   errors?: Record<string, string>,
	 *   iconUrl?: string | null,
	 *   closeHref: string,
	 *   onclose?: (event: MouseEvent) => void,
	 *   ondone?: (location: string) => void
	 * }}
	 */
	const {
		kind,
		heading,
		submitLabel,
		action,
		answers = { name: '', url: '' },
		errors: initialErrors = {},
		iconUrl = null,
		closeHref,
		onclose,
		ondone
	} = $props()

	let name = $state(untrack(() => answers.name))
	let errors = $state(untrack(() => initialErrors))
	/** @type {string | null} */
	let preview = $state(untrack(() => iconUrl))

	const pickIcon = (/** @type {Event} */ event) => {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget)
		const file = input.files?.[0]
		if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
		if (!file) {
			preview = iconUrl
			return
		}
		const problem = iconError(file)
		errors = { ...errors, icon: problem ?? '' }
		preview = problem ? iconUrl : URL.createObjectURL(file)
	}

	/** @type {import('$app/forms').SubmitFunction} */
	const submit =
		() =>
		async ({ result }) => {
			if (result.type === 'failure') {
				errors = /** @type {Record<string, string>} */ (result.data?.errors ?? {})
				return
			}
			if (result.type === 'redirect') {
				if (ondone) ondone(result.location)
				else await goto(result.location, { invalidateAll: true })
				return
			}
			if (result.type === 'error') errors = { form: 'Something went wrong. Try again.' }
		}
</script>

<div class="tile-form">
	<div class="tile-form-top">
		<a class="tile-form-close" href={closeHref} aria-label="Close" onclick={onclose}>
			<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1 1 11" /></svg>
		</a>
	</div>

	<h1 class="tile-form-heading">{heading}</h1>

	<form
		class="tile-form-body"
		method="POST"
		{action}
		enctype="multipart/form-data"
		use:enhance={submit}
	>
		<CalmField
			label={kind === 'app' ? 'Name' : 'What is it'}
			name="name"
			value={answers.name}
			placeholder={kind === 'app' ? 'Figma' : 'Belastingdienst, btw aangifte'}
			maxlength={60}
			required
			autocomplete="off"
			error={errors.name}
			oninput={(/** @type {Event} */ event) =>
				(name = /** @type {HTMLInputElement} */ (event.currentTarget).value)}
		/>
		<CalmField
			label="Link"
			name="url"
			value={answers.url}
			placeholder={kind === 'app' ? 'https://figma.com' : 'https://'}
			inputmode="url"
			autocomplete="url"
			required
			hint={kind === 'app'
				? 'Paste the address of the page you want to open.'
				: 'Opens in a new tab.'}
			error={errors.url}
		/>

		{#if kind === 'app'}
			<div class="tile-form-icon">
				<span class="tile-form-label">Icon <span>optional</span></span>
				<label for="tile-icon">
					<span class="tile-form-icon-face" aria-hidden="true">
						{#if preview}<img src={preview} alt="" />{:else}{initialOf(name) || '+'}{/if}
					</span>
					<span class="tile-form-icon-text">
						<span class="tile-form-icon-title">
							{iconUrl ? 'Change the icon' : 'Upload an icon'}
						</span>
						<span>PNG, JPG, SVG or WEBP, max 1 MB. No icon? Then the first letter is used.</span>
					</span>
				</label>
				<input
					id="tile-icon"
					class="visually-hidden"
					type="file"
					name="icon"
					accept={ICON_ACCEPT}
					aria-invalid={errors.icon ? 'true' : undefined}
					aria-describedby={errors.icon ? 'tile-icon-error' : undefined}
					onchange={pickIcon}
				/>
				{#if errors.icon}<p id="tile-icon-error" class="tile-form-error">{errors.icon}</p>{/if}
			</div>
		{/if}

		{#if errors.form}<p class="tile-form-error" role="alert">{errors.form}</p>{/if}

		<div class="tile-form-bottom">
			{#if kind === 'app'}
				<div class="tile-form-preview">
					<WorkspaceTile name={name || 'Your app'} iconUrl={preview} />
					<span>This is how it shows in your workspace</span>
				</div>
			{/if}
			<button class="tile-form-submit">{submitLabel}</button>
		</div>
	</form>
</div>

<style>
	.tile-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
		min-block-size: 100%;
	}

	.tile-form-top {
		display: flex;
		justify-content: flex-end;
	}

	.tile-form-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: var(--size-touch);
		block-size: var(--size-touch);
		border: var(--line);
		border-radius: var(--radius-pill);
		color: var(--color-text);
	}

	.tile-form-close svg {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		stroke: currentColor;
		stroke-width: 1.5;
	}

	.tile-form-heading {
		font-size: clamp(1.375rem, 1.2rem + 0.8vw, 1.625rem);
		line-height: 1.15;
		text-transform: uppercase;
	}

	.tile-form-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--space-l);
	}

	.tile-form-icon {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.tile-form-label {
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
	}

	.tile-form-label span {
		color: var(--color-text-calm);
		font-weight: 500;
		text-transform: none;
	}

	label {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		padding: var(--space-s);
		border: var(--line);
		border-style: dashed;
		border-radius: var(--radius-item);
		cursor: pointer;
	}

	.tile-form-icon:has(input:focus-visible) label {
		outline: 2px solid var(--color-text);
		outline-offset: 2px;
	}

	.tile-form-icon-face {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		inline-size: 3.5rem;
		block-size: 3.5rem;
		overflow: hidden;
		border: var(--line);
		border-radius: var(--radius-item);
		font-size: 1.25rem;
		font-weight: 800;
	}

	.tile-form-icon-face img {
		inline-size: 2.25rem;
		block-size: 2.25rem;
		object-fit: contain;
	}

	.tile-form-icon-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.tile-form-icon-title {
		color: var(--color-text);
		font-weight: 700;
		text-transform: uppercase;
	}

	.tile-form-error {
		color: var(--color-error);
		font-size: var(--font-size-label);
	}

	.tile-form-bottom {
		position: sticky;
		inset-block-end: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		margin-block-start: auto;
		padding-block: var(--space-s);
		border-block-start: var(--line);
		background-color: var(--color-background);
	}

	.tile-form-preview {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	.tile-form-submit {
		min-block-size: 3.25rem;
		border: var(--line);
		border-radius: var(--radius-pill);
		background: transparent;
		font-family: var(--font-family-display);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-heading);
		text-transform: uppercase;
		cursor: pointer;
	}

	.tile-form-submit:hover {
		text-decoration: underline;
	}
</style>

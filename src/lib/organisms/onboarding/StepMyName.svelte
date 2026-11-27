<script>
	import { enhance } from '$app/forms'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import TypedLine from '#lib/molecules/TypedLine.svelte'
	import { stepAction } from '#lib/utils/onboarding.js'
	import { ASSISTANT_DEFAULT_NAME, ASSISTANT_NAME_MAX } from '#lib/utils/constants.js'

	/** @type {{ shape: string, label: string, userName: string | null, assistantName: string | null, plea: boolean }} */
	const { shape, label, userName, assistantName, plea: pleaded } = $props()

	const who = $derived(userName?.trim() || ASSISTANT_DEFAULT_NAME)
	let plea = $derived(pleaded)
</script>

<div class="step">
	<MascotStage size="min(220px, 55vw)" {shape} {label} />

	<h1 class="onboarding-title">Nice to meet you, {who}.</h1>
	{#if !userName?.trim()}
		<p class="onboarding-line">no name? very secret agent of you.</p>
	{/if}
	<p class="onboarding-text">
		Now me. Everyone calls me "the blob", which honestly hurts a little. Want to give me a real
		name?
	</p>

	<form class="step-form" method="POST" action={stepAction('my-name', 'myName')} use:enhance>
		<!-- Pressing Enter in the field means "Name me" -->
		<button class="visually-hidden" name="intent" value="name" tabindex="-1" aria-hidden="true"
		></button>
		<label class="onboarding-field">
			My new name
			<input
				name="assistant_name"
				value={assistantName ?? ''}
				maxlength={ASSISTANT_NAME_MAX}
				autocomplete="off"
				placeholder="Something iconic, no pressure"
				oninput={() => (plea = false)}
			/>
		</label>
		{#if plea}
			<TypedLine
				class="onboarding-line"
				text="please give me a name. I don't want to be {ASSISTANT_DEFAULT_NAME}."
			/>
		{/if}
		<input type="hidden" name="plea" value={plea ? 'yes' : ''} />
		<div class="onboarding-actions">
			<button class="button button-secondary" name="intent" value="skip">
				{plea ? `Fine, be ${ASSISTANT_DEFAULT_NAME}` : 'No name'}
			</button>
			<button class="button button-primary" name="intent" value="name">Name me</button>
		</div>
	</form>
</div>

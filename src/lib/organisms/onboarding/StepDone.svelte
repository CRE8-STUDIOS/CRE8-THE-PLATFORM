<script>
	import { enhance } from '$app/forms'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import { stepAction } from '#lib/utils/onboarding.js'
	import { ASSISTANT_DEFAULT_NAME } from '#lib/utils/constants.js'
	import { sounds } from '#lib/utils/sound.js'

	$effect(() => sounds.sparkle())

	/** @type {{ shape: string, color: string, label: string, userName: string | null, assistantName: string | null, matched: boolean, restart: string }} */
	const { shape, color, label, userName, assistantName, matched, restart } = $props()

	const who = $derived(userName?.trim() || ASSISTANT_DEFAULT_NAME)
	const bot = $derived(
		assistantName || `${ASSISTANT_DEFAULT_NAME} (your assistant, against its will)`
	)
</script>

<div class="step" data-assistant-color={color}>
	<MascotStage size="min(220px, 55vw)" {shape} {label} />

	<p class="onboarding-line">let's get to work</p>
	<h1 class="onboarding-shout">All set, {who}.</h1>
	<p class="onboarding-text">
		{bot} will be right here in the corner if you need me. Quietly judging your folder names. Lovingly.{matched
			? ' And your workspace matches me now, so we are basically twins.'
			: ''}
	</p>

	<form method="POST" action={stepAction('done', 'finish')} use:enhance>
		<div class="onboarding-actions">
			<a class="button button-secondary" href={restart}>Start over</a>
			<button class="button button-primary">Go to my overview</button>
		</div>
	</form>
</div>

<script>
	import { enhance } from '$app/forms'
	import Mascot from '#lib/atoms/Mascot.svelte'
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import { stepAction } from '#lib/utils/onboarding.js'

	/** @type {{ shape: string, color: string, label: string }} */
	const { shape, color, label } = $props()
</script>

<div class="step" data-assistant-color={color}>
	<MascotStage size="150px" {shape} {label} />

	<h1 class="onboarding-title">Looking good. Us, I mean.</h1>
	<p class="onboarding-text">
		Want your whole workspace to match me? Same color, same energy. Very aesthetic, very main
		character. You can always change it in Settings.
	</p>

	<div class="preview" aria-hidden="true">
		<div class="preview-side">
			<Mascot size="26px" {shape} face={false} animate={false} />
			<span class="bar strong" style:inline-size="70%"></span>
			<span class="bar" style:inline-size="55%"></span>
			<span class="bar" style:inline-size="62%"></span>
		</div>
		<div class="preview-main">
			<span class="preview-title"></span>
			<div class="preview-cards">
				<span class="preview-card"></span>
				<span class="preview-card"></span>
			</div>
			<span class="preview-button"></span>
		</div>
	</div>

	<form method="POST" action={stepAction('workspace', 'workspace')} use:enhance>
		<div class="onboarding-actions">
			<button class="button button-secondary" name="match" value="no">Keep it classic</button>
			<button class="button button-primary" name="match" value="yes">Yes, match me</button>
		</div>
	</form>
</div>

<style>
	.preview {
		display: flex;
		inline-size: 100%;
		max-inline-size: 420px;
		block-size: 170px;
		overflow: hidden;
		border: 1.5px solid var(--color-text);
		border-radius: var(--radius-card);
		background-color: var(--color-surface);
		text-align: start;
	}

	.preview-side {
		display: flex;
		flex-direction: column;
		gap: 10px;
		inline-size: 110px;
		padding: 14px;
		border-inline-end: 1.5px solid var(--color-text);
		background-color: var(--assistant-tint);
	}

	.bar {
		block-size: 6px;
		border-radius: 3px;
		background-color: var(--color-text);
		opacity: 0.35;
	}

	.bar.strong {
		opacity: 1;
	}

	.preview-main {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 10px;
		padding: 16px;
	}

	.preview-title {
		inline-size: 60%;
		block-size: 10px;
		border-radius: 5px;
		background-color: var(--color-text);
	}

	.preview-cards {
		display: flex;
		flex: 1;
		gap: 8px;
	}

	.preview-card {
		flex: 1;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background-color: var(--color-background);
	}

	.preview-button {
		align-self: flex-end;
		inline-size: 80px;
		block-size: 22px;
		border-radius: var(--radius-pill);
		background-color: var(--mascot-color);
	}
</style>

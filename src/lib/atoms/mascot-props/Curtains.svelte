<script>
	/** @type {{ closed: boolean }} */
	const { closed } = $props()
</script>

<div class="valance" aria-hidden="true"></div>
<div class="curtain left" class:closed aria-hidden="true"></div>
<div class="curtain right" class:closed aria-hidden="true"></div>

<style>
	.valance {
		position: absolute;
		inset-block-start: 0;
		inset-inline: 0;
		z-index: 3;
		block-size: 26px;
		border-block-end: 3px solid var(--color-text);
		background: repeating-linear-gradient(90deg, #8e1d17 0 18px, #b3261e 18px 36px);
	}

	.curtain {
		position: absolute;
		inset-block: 0;
		z-index: 2;
		inline-size: 51%;
		background: repeating-linear-gradient(90deg, #b3261e 0 14px, #8e1d17 14px 22px);
		transition: transform 0.7s cubic-bezier(0.6, 0, 0.3, 1);
	}

	.left {
		inset-inline-start: 0;
		border-inline-end: 3px solid var(--color-text);
		transform: translateX(-102%);
	}

	.right {
		inset-inline-end: 0;
		border-inline-start: 3px solid var(--color-text);
		transform: translateX(102%);
	}

	.curtain.closed {
		transform: translateX(0);
	}
</style>

<script>
	import MascotStage from '#lib/molecules/MascotStage.svelte'
	import Foam from '#lib/atoms/mascot-props/Foam.svelte'

	/** @type {{ shape?: string }} */
	const { shape } = $props()
</script>

<div class="mirror" aria-hidden="true">
	<span class="mirror-glare"></span>
	<div class="mirror-reflection">
		<MascotStage size="120px" {shape} face={false} motion="still">
			{#snippet front()}<Foam />{/snippet}
		</MascotStage>
	</div>
</div>

<style>
	.mirror {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		inline-size: 150px;
		block-size: 240px;
		overflow: hidden;
		border: 7px solid var(--color-text);
		border-radius: 50%;
		background-color: #e2e8f3;
	}

	.mirror-glare {
		position: absolute;
		inset-block-start: 26px;
		inset-inline-start: 26px;
		inline-size: 10px;
		block-size: 70px;
		border-radius: 5px;
		background-color: #ffffff;
		opacity: 0.8;
		transform: rotate(18deg);
	}

	.mirror-reflection {
		opacity: 0.55;
		transform: scaleX(-1);
	}
</style>

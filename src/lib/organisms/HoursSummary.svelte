<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/** @type {{ project: { id: string, title: string } | null, year: number, totalHours: number, hoursCriterion: number, criterionPercentage: number }} */
	const { project, year, totalHours, hoursCriterion, criterionPercentage } = $props()
</script>

<section class="hours-summary card rough-edge">
	<Heading>Total</Heading>
	{#if project}
		<p class="stat-number">{totalHours} h</p>
		<p>On this project. <a href="/time">See all hours</a></p>
	{:else}
		<p class="label text-muted">{year}</p>
		<p class="stat-number">{totalHours} <span class="text-small">of {hoursCriterion} h</span></p>
		<meter
			min="0"
			max="100"
			value={criterionPercentage}
			aria-label="Progress towards the hours criterion"
		>
			{criterionPercentage}%
		</meter>
		<p class="text-small text-muted">
			{criterionPercentage}% of the hours criterion (zelfstandigenaftrek)
		</p>
	{/if}
</section>

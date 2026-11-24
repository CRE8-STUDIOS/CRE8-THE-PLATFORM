<script>
	import Heading from '#lib/atoms/Heading.svelte'

	/**
	 * Total hours: on one project, or this year against the 1,225-hour criterion.
	 * @type {{ project: { id: string, title: string } | null, year: number, totalHours: number, hoursCriterion: number, criterionPercentage: number }}
	 */
	const { project, year, totalHours, hoursCriterion, criterionPercentage } = $props()
</script>

<section class="hours-summary">
	<Heading>Total</Heading>
	{#if project}
		<p><strong>{totalHours} h</strong> on this project. <a href="/time">See all hours</a></p>
	{:else}
		<p><strong>{year}: {totalHours} of {hoursCriterion} hours</strong></p>
		<meter
			min="0"
			max="100"
			value={criterionPercentage}
			aria-label="Progress towards the hours criterion"
		>
			{criterionPercentage}%
		</meter>
		<p>{criterionPercentage}% of the hours criterion (zelfstandigenaftrek)</p>
	{/if}
</section>

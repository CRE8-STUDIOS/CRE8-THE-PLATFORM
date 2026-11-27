<script>
	import MascotSays from '#lib/molecules/MascotSays.svelte'
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import PillRadio from '#lib/atoms/PillRadio.svelte'
	import OutlineButton from '#lib/atoms/OutlineButton.svelte'
	import LessonHeading from '#lib/organisms/guide/LessonHeading.svelte'
	import { BUSINESS_TYPES } from '#lib/guide/compare.js'

	const { data, form } = $props()
</script>

<svelte:head><title>{data.lesson.title} · CRE8</title></svelte:head>

<LessonHeading {...data.lesson} total={data.total} />

<MascotSays>
	<p>
		Most freelancers in the Netherlands start as an eenmanszaak. Some have a bv. Here is the
		difference, side by side.
	</p>
</MascotSays>

<!-- The table scrolls on small screens, so the box has to be reachable with the keyboard -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="compare" role="region" aria-labelledby="compare-caption" tabindex="0">
	<table>
		<caption id="compare-caption" class="visually-hidden">Eenmanszaak and bv compared</caption>
		<thead>
			<tr>
				<td></td>
				<th scope="col">Eenmanszaak</th>
				<th scope="col">Bv</th>
			</tr>
		</thead>
		<tbody>
			{#each data.comparison as row (row.topic)}
				<tr>
					<th scope="row">{row.topic}</th>
					<td>{row.eenmanszaak}</td>
					<td>{row.bv}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<p class="compare-note">
	Working together with someone? Then there is also the vof, an eenmanszaak for two or more people.
	{data.year} numbers, updated every year. Guidance, not advice: an accountant can help you choose.
</p>

<CalmSection id="picker-heading" heading="What are you right now?">
	{#snippet aside()}
		<span>I adjust CRE8 to your answer</span>
	{/snippet}
	<form class="picker" method="POST">
		<fieldset>
			<legend class="visually-hidden">Your business type</legend>
			{#each BUSINESS_TYPES as type (type.value)}
				<PillRadio
					name="business_type"
					value={type.value}
					checked={(data.businessType ?? 'eenmanszaak') === type.value}
				>
					{type.label}
				</PillRadio>
			{/each}
		</fieldset>
		{#if form?.message}<p class="picker-error" role="alert">{form.message}</p>{/if}
		<div class="picker-actions">
			<OutlineButton strong>Save and next lesson</OutlineButton>
			<a href="/guide/money/business-types/chat">Do it as a chat instead</a>
		</div>
	</form>
</CalmSection>

<style>
	.compare {
		overflow-x: auto;
		border-block-start: var(--line-strong);
	}

	.compare:focus-visible {
		outline: var(--focus-outline);
		outline-offset: var(--focus-offset);
	}

	table {
		inline-size: 100%;
		min-inline-size: 40rem;
		border-collapse: collapse;
	}

	thead th {
		padding-block: var(--space-s);
		color: var(--color-text);
		font-size: var(--font-size-small);
		font-weight: 800;
		text-align: start;
		text-transform: uppercase;
	}

	thead tr {
		border-block-end: var(--line-strong);
	}

	tbody tr {
		border-block-end: var(--line-quiet);
	}

	th,
	td {
		padding: var(--space-s) var(--space-m) var(--space-s) 0;
		vertical-align: top;
	}

	tbody th {
		inline-size: 12rem;
		font-size: var(--font-size-agenda-label);
		font-weight: 700;
		text-align: start;
		text-transform: uppercase;
	}

	tbody td {
		font-size: var(--font-size-agenda-meta);
		line-height: 1.5;
	}

	.compare-note {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
		line-height: 1.5;
	}

	.picker {
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
	}

	fieldset {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin: 0;
		padding: 0;
		border: 0;
	}

	.picker-error {
		color: var(--color-error);
		font-size: var(--font-size-label);
	}

	.picker-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-m);
	}

	.picker-actions a {
		color: var(--color-text);
		font-size: var(--font-size-agenda-meta);
		font-weight: 700;
		text-transform: uppercase;
	}
</style>

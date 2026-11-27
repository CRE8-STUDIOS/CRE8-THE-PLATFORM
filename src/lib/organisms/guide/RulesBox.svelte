<script>
	import CalmSection from '#lib/molecules/CalmSection.svelte'
	import { formatRule } from '#lib/guide/rules.js'

	/**
	 * This year's numbers from the tax rules.
	 * @type {{ year: number, rules: import('#lib/guide/rules.js').Rules }}
	 */
	const { year, rules } = $props()

	/** One rule, or a question mark when it is not known */
	const value = (/** @type {string} */ key, suffix = '') =>
		key in rules ? `${formatRule(rules[key])}${suffix}` : '?'

	const rows = $derived([
		{ label: 'KVK registration, once', value: value('kvk_registration_fee') },
		{
			label: 'Btw rates',
			value: `${['btw_rate_standard', 'btw_rate_reduced', 'btw_rate_zero'].map((key) => value(key)).join(', ')}%`
		},
		{ label: 'KOR limit per year', value: value('kor_turnover_limit') },
		{ label: 'Hours criterion', value: value('hours_criterion', ' h') },
		{ label: 'Zelfstandigenaftrek', value: value('zelfstandigenaftrek') },
		{ label: 'Startersaftrek', value: value('startersaftrek') },
		{ label: 'Keep your records', value: value('bewaarplicht_years', ' years') }
	])
</script>

<CalmSection id="rules-heading" heading="{year} numbers">
	<dl class="rules-box">
		{#each rows as row (row.label)}
			<div>
				<dt>{row.label}</dt>
				<dd>{row.value}</dd>
			</div>
		{/each}
	</dl>
	<p class="rules-box-note">
		Amounts in euro. They change every year and CRE8 updates them. Guidance, not tax advice.
	</p>
</CalmSection>

<style>
	.rules-box {
		margin: 0;
	}

	.rules-box div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-s);
		padding-block: var(--space-xs);
		border-block-end: var(--line-quiet);
	}

	dt {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-meta);
	}

	dd {
		margin: 0;
		font-size: var(--font-size-small);
		font-weight: 800;
		white-space: nowrap;
	}

	.rules-box-note {
		color: var(--color-text-calm);
		font-size: var(--font-size-agenda-label);
		line-height: 1.5;
	}
</style>

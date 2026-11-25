<!-- Placeholder page: the data is connected later. -->
<script>
	import FinanceHeader from '#lib/organisms/FinanceHeader.svelte'
	import Card from '#lib/molecules/Card.svelte'

	const contacts = [
		{ name: '[Contact name]', company: '[Company]' },
		{ name: '[Contact name]', company: '[Company]' },
		{ name: '[Contact name]', company: '[Company]' }
	]
</script>

<FinanceHeader current="/finance/contacts" />

<div class="contacts">
	<Card title="Contacts">
		<ul class="card-list">
			{#each contacts as { name, company }, index (index)}
				<li class="contact-row" class:contact-row-selected={index === 0}>
					<span class="avatar" aria-hidden="true">C</span>
					<span class="contact-text">
						<span class="contact-name">{name}</span>
						<span class="text-small text-muted">{company}</span>
					</span>
				</li>
			{/each}
		</ul>
		<p><a href="/clients">Manage clients</a></p>
	</Card>

	<Card title="[Contact name]" label="[Company]">
		<dl class="detail-list">
			<dt>Email</dt>
			<dd>[Email address]</dd>
			<dt>Phone</dt>
			<dd>[Phone number]</dd>
			<dt>Address</dt>
			<dd>[Street, postal code, city]</dd>
			<dt>Open facturen</dt>
			<dd>[Amount]</dd>
		</dl>
	</Card>
</div>

<style>
	.contacts {
		display: grid;
		gap: var(--space-l);
		align-items: start;
	}

	.contact-row {
		padding-inline: var(--space-xs);
		border-radius: var(--radius-small);
	}

	.contact-row-selected {
		background-color: var(--color-background);
	}

	.contact-text {
		display: grid;
	}

	.contact-name {
		font-family: var(--font-family-display);
		font-size: var(--font-size-label);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	@media (min-width: 48em) {
		.contacts {
			grid-template-columns: minmax(var(--size-grid-m), 1fr) 2fr;
		}
	}
</style>

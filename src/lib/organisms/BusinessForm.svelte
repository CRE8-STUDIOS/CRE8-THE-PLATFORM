<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import SelectField from '#lib/molecules/SelectField.svelte'
	import CheckboxField from '#lib/molecules/CheckboxField.svelte'
	import { BUSINESS_TYPES, toOptions } from '#lib/utils/constants.js'

	/** @type {{ business: import('#lib/database.types.js').Tables<'profiles'>, email: string }} */
	const { business, email } = $props()
	const lastNumber = $derived(
		business.invoice_counter_period
			? `${business.invoice_prefix ?? ''}${business.invoice_counter_period}${String(business.invoice_counter).padStart(2, '0')}`
			: 'none yet'
	)
</script>

<section class="business-form card rough-edge">
	<Heading>Business & facturen</Heading>
	<p>These details go on your facturen. Your login email: {email}</p>
	<form method="POST" action="?/save">
		<fieldset>
			<legend>You and your business</legend>
			<TextField label="Your name" name="name" value={business.name ?? ''} />
			<TextField label="Business name" name="business_name" value={business.business_name ?? ''} />
			<SelectField
				label="Business type"
				name="business_type"
				options={toOptions(BUSINESS_TYPES)}
				value={business.business_type}
			/>
			<TextField label="KvK number" name="kvk_number" value={business.kvk_number ?? ''} />
			<TextField label="Btw number" name="btw_number" value={business.btw_number ?? ''} />
			<TextField label="IBAN" name="iban" value={business.iban ?? ''} />
			<CheckboxField
				label="I use the KOR (small business scheme)"
				name="uses_kor"
				checked={business.uses_kor}
			/>
			<CheckboxField
				label="I'm a starter (startersaftrek)"
				name="is_starter"
				checked={business.is_starter}
			/>
		</fieldset>
		<fieldset>
			<legend>Address</legend>
			<TextField label="Street" name="street" value={business.street ?? ''} />
			<TextField label="Postal code" name="postal_code" value={business.postal_code ?? ''} />
			<TextField label="City" name="city" value={business.city ?? ''} />
			<TextField
				label="Country"
				name="country"
				value={business.country}
				maxlength={2}
				hint="2 letters, e.g. NL"
			/>
		</fieldset>
		<fieldset>
			<legend>Facturen</legend>
			<TextField
				label="Default hourly rate (€)"
				name="default_hourly_rate"
				inputmode="decimal"
				value={business.default_hourly_rate ?? ''}
			/>
			<TextField
				label="Invoice prefix (optional)"
				name="invoice_prefix"
				value={business.invoice_prefix ?? ''}
				hint="e.g. CRE- gives CRE-261101"
			/>
			<TextField
				label="Payment term (days)"
				name="payment_term_days"
				inputmode="numeric"
				value={business.payment_term_days}
			/>
			<TextField
				label="Reminders, days after the due date"
				name="reminder_days"
				value={business.reminder_days.join(', ')}
				hint="e.g. 3, 14, 30"
			/>
			<p>
				Numbers are YYMM + a counter that restarts every month (e.g. 261101). Last number used: {lastNumber}.
			</p>
		</fieldset>
		<Button variant="primary">Save</Button>
	</form>
</section>

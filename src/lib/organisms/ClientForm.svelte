<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'

	/**
	 * @type {{
	 *   title: string, action: string, submitLabel: string,
	 *   client?: { name: string, company: string | null, email: string | null, phone: string | null, street: string | null, postal_code: string | null, city: string | null, country: string, btw_number: string | null },
	 *   form: { message?: string, success?: string } | null | undefined,
	 *   id?: string
	 * }}
	 */
	const { title, action, submitLabel, client, form, id } = $props()
</script>

<section {id} class="client-form card rough-edge">
	<Heading>{title}</Heading>
	<FormNotice {form} />
	<form method="POST" {action}>
		<TextField label="Name" name="name" value={client?.name ?? ''} required />
		<TextField label="Company" name="company" value={client?.company ?? ''} />
		<TextField label="Email" name="email" type="email" value={client?.email ?? ''} />
		<TextField label="Phone" name="phone" type="tel" value={client?.phone ?? ''} />
		<fieldset>
			<legend>Address (for facturen)</legend>
			<TextField label="Street" name="street" value={client?.street ?? ''} />
			<TextField label="Postal code" name="postal_code" value={client?.postal_code ?? ''} />
			<TextField label="City" name="city" value={client?.city ?? ''} />
			<TextField
				label="Country"
				name="country"
				value={client?.country ?? 'NL'}
				maxlength={2}
				hint="2 letters, e.g. NL, BE, DE"
			/>
		</fieldset>
		<TextField
			label="Btw number"
			name="btw_number"
			value={client?.btw_number ?? ''}
			hint="Clients in other EU countries with a btw number get reverse charge"
		/>
		<Button variant="primary">{submitLabel}</Button>
	</form>
</section>

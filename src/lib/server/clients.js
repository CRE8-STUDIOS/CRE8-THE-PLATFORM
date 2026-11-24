import { text } from '#lib/server/form.js'

/** Client fields from a create/edit form. */
export const clientFromForm = (/** @type {FormData} */ formData) => ({
	name: text(formData, 'name') ?? '',
	company: text(formData, 'company'),
	email: text(formData, 'email'),
	phone: text(formData, 'phone'),
	street: text(formData, 'street'),
	postal_code: text(formData, 'postal_code'),
	city: text(formData, 'city'),
	country: (text(formData, 'country') ?? 'NL').toUpperCase(),
	btw_number: text(formData, 'btw_number')
})

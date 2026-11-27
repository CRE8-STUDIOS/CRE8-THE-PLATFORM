/**
 * The eenmanszaak and bv comparison of the first lesson. Numbers in curly
 * braces come from the tax rules.
 */
export const comparison = [
	{
		topic: 'What it is',
		eenmanszaak: 'You. You and your business are one person in the eyes of the law.',
		bv: 'A separate company with its own money. You work for it.'
	},
	{
		topic: 'How you start',
		eenmanszaak: 'Register yourself at the KVK. No notary.',
		bv: 'Through a notary, who registers the bv at the KVK.'
	},
	{
		topic: 'Start costs',
		eenmanszaak: '{kvk_registration_fee} euro, once.',
		bv: 'Notary costs on top of the KVK fee.'
	},
	{
		topic: 'Your private money',
		eenmanszaak: 'If the business has debts, you pay them with your own money too.',
		bv: 'Debts stay in the bv. Your private money is protected.'
	},
	{
		topic: 'Tax',
		eenmanszaak: 'Income tax over your profit.',
		bv: 'The bv pays company tax: {vpb_rate_low}% up to {vpb_bracket} euro profit, {vpb_rate_high}% above.'
	},
	{
		topic: 'Freelancer deductions',
		eenmanszaak: 'Yes, like the zelfstandigenaftrek, if you work {hours_criterion} hours.',
		bv: 'No.'
	},
	{
		topic: 'Your salary',
		eenmanszaak: 'You take what you need from your profit.',
		bv: 'You pay yourself a salary of at least {gebruikelijk_loon} euro a year.'
	},
	{
		topic: 'Often a good fit',
		eenmanszaak: 'Starting out, mostly selling your time and ideas.',
		bv: 'Earning a lot, or taking bigger risks.'
	}
]

/** The answers of "What are you right now?", as saved in profiles.business_type */
export const BUSINESS_TYPES = /** @type {const} */ ([
	{ value: 'eenmanszaak', label: 'Eenmanszaak' },
	{ value: 'bv', label: 'Bv' },
	{ value: 'not_registered', label: 'Not registered yet' },
	{ value: 'abroad', label: 'Business outside the Netherlands' }
])

/** @typedef {typeof BUSINESS_TYPES[number]['value']} BusinessType */

/** True for a value profiles.business_type accepts */
export const isBusinessType = (/** @type {unknown} */ value) =>
	BUSINESS_TYPES.some((type) => type.value === value)

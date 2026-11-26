export const AGENDA_TYPES = ['meeting', 'work', 'shoot', 'deadline', 'rest', 'task', 'errand']
export const ENERGY_TYPES = ['creative', 'admin', 'other']
export const PROJECT_STATUSES = ['draft', 'active', 'done', 'archived']
export const TIME_CATEGORIES = ['client_work', 'admin', 'acquisition', 'training']
export const VAT_TREATMENTS = ['standard', 'kor', 'reverse_charge', 'outside_eu']
export const VAT_RATES = [21, 9, 0]
export const WEEKDAYS = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
]
export const WORKING_HOURS_KINDS = ['work', 'creative', 'meetings']
export const BUSINESS_TYPES = ['eenmanszaak', 'bv', 'not_registered', 'abroad']
export const MOODBOARD_ITEM_TYPES = ['image', 'color', 'text', 'link']
export const CLOCK_IN_MODES = ['ask', 'auto', 'off']
export const CLOCK_START_SOURCES = ['manual', 'prompt', 'auto']
export const CLOCK_STOP_REASONS = ['manual', 'switch', 'no_answer', 'inactive']

export const EU_COUNTRIES = [
	'AT',
	'BE',
	'BG',
	'HR',
	'CY',
	'CZ',
	'DK',
	'EE',
	'FI',
	'FR',
	'DE',
	'GR',
	'HU',
	'IE',
	'IT',
	'LV',
	'LT',
	'LU',
	'MT',
	'PL',
	'PT',
	'RO',
	'SK',
	'SI',
	'ES',
	'SE'
]

export const toOptions = (/** @type {readonly (string | number)[]} */ values) =>
	values.map((value) => ({ value: String(value), label: String(value).replaceAll('_', ' ') }))

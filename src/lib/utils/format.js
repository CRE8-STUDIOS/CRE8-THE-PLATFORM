/** Money in euros, Dutch notation (€ 1.234,56). */
export const euro = (/** @type {number | null | undefined} */ value) =>
	new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value ?? 0)

/** File size in KB or MB. */
export const fileSize = (/** @type {number | null | undefined} */ bytes) => {
	if (!bytes) return ''
	return bytes > 1_048_576
		? `${(bytes / 1_048_576).toFixed(1)} MB`
		: `${Math.round(bytes / 1024)} KB`
}

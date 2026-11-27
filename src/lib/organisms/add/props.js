/**
 * Props every add form takes.
 * @typedef {{
 *   action: string,
 *   answers: Record<string, string>,
 *   errors?: Record<string, string>,
 *   sentence?: string,
 *   context: import('#lib/agenda/fit.js').FitContext,
 *   projects: { value: string, label: string }[],
 *   changeTypeHref?: string | null,
 *   closeHref: string,
 *   onclose?: (event: MouseEvent) => void,
 *   onchangetype?: (event: MouseEvent) => void,
 *   heading?: string,
 *   submitLabel?: string,
 *   before?: import('svelte').Snippet
 * }} AddFormProps
 */
export {}

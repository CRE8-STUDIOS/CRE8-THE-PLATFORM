/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => ({ query: url.search, addStep: 'choose' })

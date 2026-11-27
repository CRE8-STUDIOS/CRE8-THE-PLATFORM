import { redirect } from '@sveltejs/kit'

/** Apps are managed on the workspace now */
export const load = () => redirect(308, '/workspace?edit')

/** @type {{ name: string | null, color: import('#lib/database.types.js').Enums<'assistant_color'>, shape: import('#lib/database.types.js').Enums<'assistant_shape'>, matchWorkspace: boolean }} */
const DEFAULT_ASSISTANT = { name: null, color: 'ink', shape: 'splat', matchWorkspace: false }

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, cookies }) => {
	const { supabase, user, role, timezone } = locals

	let assistant = DEFAULT_ASSISTANT
	if (user && role === 'freelancer') {
		const { data: profile } = await supabase
			.from('profiles')
			.select('assistant_name, assistant_color, assistant_shape, workspace_matches_assistant')
			.eq('id', user.id)
			.maybeSingle()

		if (profile)
			assistant = {
				name: profile.assistant_name,
				color: profile.assistant_color,
				shape: profile.assistant_shape,
				matchWorkspace: profile.workspace_matches_assistant
			}
	}

	return {
		user,
		role,
		timezone,
		assistant,
		cookies: cookies.getAll()
	}
}

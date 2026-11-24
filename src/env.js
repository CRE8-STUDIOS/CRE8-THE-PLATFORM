import { defineEnvVars } from '@sveltejs/kit/env'

// Environment variables for CRE8. Values come from the .env file (never commit it).
// Both are safe for the browser: the database is protected by Row Level Security.
export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		description: 'Supabase project URL'
	},
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: {
		public: true,
		description: 'Supabase publishable key (sb_publishable_...), safe to use in the browser'
	}
})

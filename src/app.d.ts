import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#lib/database.types.js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			/** The logged-in user (verified with getClaims), or null */
			user: { id: string; email: string | null } | null
			/** 'freelancer' has a profile, 'client' has a client account, null = not logged in or unknown */
			role: 'freelancer' | 'client' | null
			/** The freelancer's time zone (from profiles), used to read and show dates */
			timezone: string
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}

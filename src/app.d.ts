import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#lib/database.types.js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			user: { id: string; email: string | null } | null
			role: 'freelancer' | 'client' | null
			timezone: string
		}
	}
}

export {}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#lib/database.types.js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			user: { id: string; email: string | null } | null
			role: 'freelancer' | 'client' | null
			timezone: string
			onboarded: boolean
		}
		interface PageState {
			/** The add panel, opened over the current page */
			add?: { href: string; depth: number; data: Record<string, any> }
			/** A workspace panel to add or change an app or link */
			tile?: { href: string; data: Record<string, any> }
		}
	}
}

export {}

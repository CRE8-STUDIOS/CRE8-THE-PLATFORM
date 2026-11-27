export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      agenda_checklist_items: {
        Row: {
          agenda_item_id: string
          created_at: string
          done: boolean
          id: string
          label: string
          position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          agenda_item_id: string
          created_at?: string
          done?: boolean
          id?: string
          label: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          agenda_item_id?: string
          created_at?: string
          done?: boolean
          id?: string
          label?: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_checklist_items_agenda_item_id_user_id_fkey"
            columns: ["agenda_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "agenda_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "agenda_checklist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_items: {
        Row: {
          address: string | null
          all_day: boolean
          board_status: Database["public"]["Enums"]["board_status"] | null
          call_time: string | null
          client_feedback: string | null
          client_review_status:
            | Database["public"]["Enums"]["client_review_status"]
            | null
          closes_at: string | null
          color: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          ends_at: string | null
          energy: Database["public"]["Enums"]["energy_type"] | null
          estimated_minutes: number | null
          id: string
          is_protected: boolean
          latitude: number | null
          location_name: string | null
          longitude: number | null
          meeting_url: string | null
          opens_at: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          project_id: string | null
          recurrence_rule: string | null
          recurrence_until: string | null
          reminder_minutes: number[]
          request_id: string | null
          review_sent_at: string | null
          reviewed_at: string | null
          source: Database["public"]["Enums"]["agenda_source"]
          source_id: string | null
          starts_at: string | null
          status: Database["public"]["Enums"]["agenda_item_status"]
          title: string
          travel_after_minutes: number
          travel_before_minutes: number
          type: Database["public"]["Enums"]["agenda_item_type"]
          updated_at: string
          user_id: string
          wrap_at: string | null
        }
        Insert: {
          address?: string | null
          all_day?: boolean
          board_status?: Database["public"]["Enums"]["board_status"] | null
          call_time?: string | null
          client_feedback?: string | null
          client_review_status?:
            | Database["public"]["Enums"]["client_review_status"]
            | null
          closes_at?: string | null
          color?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          ends_at?: string | null
          energy?: Database["public"]["Enums"]["energy_type"] | null
          estimated_minutes?: number | null
          id?: string
          is_protected?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          meeting_url?: string | null
          opens_at?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id?: string | null
          recurrence_rule?: string | null
          recurrence_until?: string | null
          reminder_minutes?: number[]
          request_id?: string | null
          review_sent_at?: string | null
          reviewed_at?: string | null
          source?: Database["public"]["Enums"]["agenda_source"]
          source_id?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["agenda_item_status"]
          title: string
          travel_after_minutes?: number
          travel_before_minutes?: number
          type?: Database["public"]["Enums"]["agenda_item_type"]
          updated_at?: string
          user_id?: string
          wrap_at?: string | null
        }
        Update: {
          address?: string | null
          all_day?: boolean
          board_status?: Database["public"]["Enums"]["board_status"] | null
          call_time?: string | null
          client_feedback?: string | null
          client_review_status?:
            | Database["public"]["Enums"]["client_review_status"]
            | null
          closes_at?: string | null
          color?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          ends_at?: string | null
          energy?: Database["public"]["Enums"]["energy_type"] | null
          estimated_minutes?: number | null
          id?: string
          is_protected?: boolean
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          meeting_url?: string | null
          opens_at?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id?: string | null
          recurrence_rule?: string | null
          recurrence_until?: string | null
          reminder_minutes?: number[]
          request_id?: string | null
          review_sent_at?: string | null
          reviewed_at?: string | null
          source?: Database["public"]["Enums"]["agenda_source"]
          source_id?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["agenda_item_status"]
          title?: string
          travel_after_minutes?: number
          travel_before_minutes?: number
          type?: Database["public"]["Enums"]["agenda_item_type"]
          updated_at?: string
          user_id?: string
          wrap_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_items_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "agenda_items_request_id_user_id_fkey"
            columns: ["request_id", "user_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "agenda_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_people: {
        Row: {
          agenda_item_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agenda_item_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          agenda_item_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_people_agenda_item_id_user_id_fkey"
            columns: ["agenda_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "agenda_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "agenda_people_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_accounts: {
        Row: {
          auth_user_id: string
          created_at: string
          display_name: string | null
          email: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          updated_at?: string
          username: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          archived_at: string | null
          btw_number: string | null
          city: string | null
          company: string | null
          country: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          street: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          btw_number?: string | null
          city?: string | null
          company?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          btw_number?: string | null
          city?: string | null
          company?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          body: string
          created_at: string
          id: string
          pdf_path: string | null
          project_id: string
          sent_at: string | null
          signature_data: string | null
          signed_at: string | null
          signed_by: string | null
          signed_ip: unknown
          status: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          pdf_path?: string | null
          project_id: string
          sent_at?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signed_by?: string | null
          signed_ip?: unknown
          status?: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          pdf_path?: string | null
          project_id?: string
          sent_at?: string | null
          signature_data?: string | null
          signed_at?: string | null
          signed_by?: string | null
          signed_ip?: unknown
          status?: Database["public"]["Enums"]["contract_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "contracts_signed_by_fkey"
            columns: ["signed_by"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_tiles: {
        Row: {
          created_at: string
          group_name: string | null
          icon_path: string | null
          id: string
          kind: Database["public"]["Enums"]["tile_kind"]
          name: string
          position: number
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_name?: string | null
          icon_path?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["tile_kind"]
          name: string
          position?: number
          updated_at?: string
          url: string
          user_id?: string
        }
        Update: {
          created_at?: string
          group_name?: string | null
          icon_path?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["tile_kind"]
          name?: string
          position?: number
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_tiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount_excl_vat: number
          category: string | null
          created_at: string
          date: string
          id: string
          note: string | null
          project_id: string | null
          receipt_path: string | null
          supplier: string | null
          updated_at: string
          user_id: string
          vat_amount: number
          vat_rate: number | null
        }
        Insert: {
          amount_excl_vat: number
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          project_id?: string | null
          receipt_path?: string | null
          supplier?: string | null
          updated_at?: string
          user_id?: string
          vat_amount?: number
          vat_rate?: number | null
        }
        Update: {
          amount_excl_vat?: number
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          project_id?: string | null
          receipt_path?: string | null
          supplier?: string | null
          updated_at?: string
          user_id?: string
          vat_amount?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_lines: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          position: number
          quantity: number
          request_id: string | null
          unit_price: number
          updated_at: string
          user_id: string
          vat_rate: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          position?: number
          quantity?: number
          request_id?: string | null
          unit_price: number
          updated_at?: string
          user_id?: string
          vat_rate?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          position?: number
          quantity?: number
          request_id?: string | null
          unit_price?: number
          updated_at?: string
          user_id?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_invoice_id_user_id_fkey"
            columns: ["invoice_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoice_overview"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoice_lines_invoice_id_user_id_fkey"
            columns: ["invoice_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoice_lines_request_id_user_id_fkey"
            columns: ["request_id", "user_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoice_lines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_details: Json | null
          client_id: string
          created_at: string
          credits_invoice_id: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          issuer_details: Json | null
          last_reminder_at: string | null
          notes: string | null
          paid_at: string | null
          pdf_path: string | null
          project_id: string | null
          reminder_count: number
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string
          vat_total: number
          vat_treatment: Database["public"]["Enums"]["vat_treatment"]
        }
        Insert: {
          client_details?: Json | null
          client_id: string
          created_at?: string
          credits_invoice_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          issuer_details?: Json | null
          last_reminder_at?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_path?: string | null
          project_id?: string | null
          reminder_count?: number
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
          vat_total?: number
          vat_treatment?: Database["public"]["Enums"]["vat_treatment"]
        }
        Update: {
          client_details?: Json | null
          client_id?: string
          created_at?: string
          credits_invoice_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          issuer_details?: Json | null
          last_reminder_at?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_path?: string | null
          project_id?: string | null
          reminder_count?: number
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
          vat_total?: number
          vat_treatment?: Database["public"]["Enums"]["vat_treatment"]
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_user_id_fkey"
            columns: ["client_id", "user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_credits_invoice_id_user_id_fkey"
            columns: ["credits_invoice_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoice_overview"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_credits_invoice_id_user_id_fkey"
            columns: ["credits_invoice_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_requests: {
        Row: {
          agenda_item_id: string | null
          client_account_id: string
          created_at: string
          ends_at: string
          id: string
          message: string | null
          project_id: string
          responded_at: string | null
          starts_at: string
          status: Database["public"]["Enums"]["meeting_request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          agenda_item_id?: string | null
          client_account_id: string
          created_at?: string
          ends_at: string
          id?: string
          message?: string | null
          project_id: string
          responded_at?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["meeting_request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          agenda_item_id?: string | null
          client_account_id?: string
          created_at?: string
          ends_at?: string
          id?: string
          message?: string | null
          project_id?: string
          responded_at?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["meeting_request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_requests_agenda_item_id_user_id_fkey"
            columns: ["agenda_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "agenda_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "meeting_requests_client_account_id_fkey"
            columns: ["client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_requests_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "meeting_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moodboard_items: {
        Row: {
          content: string | null
          created_at: string
          height: number | null
          id: string
          image_path: string | null
          moodboard_id: string
          type: Database["public"]["Enums"]["moodboard_item_type"]
          updated_at: string
          user_id: string
          width: number | null
          x: number
          y: number
          z_index: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          height?: number | null
          id?: string
          image_path?: string | null
          moodboard_id: string
          type: Database["public"]["Enums"]["moodboard_item_type"]
          updated_at?: string
          user_id?: string
          width?: number | null
          x?: number
          y?: number
          z_index?: number
        }
        Update: {
          content?: string | null
          created_at?: string
          height?: number | null
          id?: string
          image_path?: string | null
          moodboard_id?: string
          type?: Database["public"]["Enums"]["moodboard_item_type"]
          updated_at?: string
          user_id?: string
          width?: number | null
          x?: number
          y?: number
          z_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "moodboard_items_moodboard_id_user_id_fkey"
            columns: ["moodboard_id", "user_id"]
            isOneToOne: false
            referencedRelation: "moodboards"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "moodboard_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moodboards: {
        Row: {
          created_at: string
          id: string
          project_id: string | null
          title: string
          updated_at: string
          user_id: string
          visible_to_client: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          project_id?: string | null
          title: string
          updated_at?: string
          user_id?: string
          visible_to_client?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "moodboards_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "moodboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          body: string | null
          created_at: string
          id: string
          project_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_access: {
        Row: {
          accepted_at: string | null
          client_account_id: string | null
          client_id: string
          created_at: string
          id: string
          invited_at: string
          invited_email: string
          last_seen_at: string | null
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          client_account_id?: string | null
          client_id: string
          created_at?: string
          id?: string
          invited_at?: string
          invited_email: string
          last_seen_at?: string | null
          project_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          accepted_at?: string | null
          client_account_id?: string | null
          client_id?: string
          created_at?: string
          id?: string
          invited_at?: string
          invited_email?: string
          last_seen_at?: string | null
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_access_client_account_id_fkey"
            columns: ["client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_access_client_id_user_id_fkey"
            columns: ["client_id", "user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "portal_access_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "portal_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assistant_color: Database["public"]["Enums"]["assistant_color"]
          assistant_name: string | null
          assistant_onboarded_at: string | null
          assistant_shape: Database["public"]["Enums"]["assistant_shape"]
          booking_days_ahead: number
          booking_notice_hours: number
          break_after_minutes: number
          break_minutes: number
          btw_number: string | null
          business_name: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          check_in_after_minutes: number
          city: string | null
          clock_in_mode: Database["public"]["Enums"]["clock_in_mode"]
          country: string
          created_at: string
          day_ends_at: string
          deadline_headsup_days: number
          default_hourly_rate: number | null
          iban: string | null
          id: string
          invoice_counter: number
          invoice_counter_period: string | null
          invoice_prefix: string | null
          is_admin: boolean
          is_starter: boolean
          kvk_number: string | null
          meeting_minutes: number
          name: string | null
          payment_term_days: number
          postal_code: string | null
          reminder_days: number[]
          street: string | null
          timezone: string
          updated_at: string
          uses_kor: boolean
          week_target_hours: number
          workspace_matches_assistant: boolean
        }
        Insert: {
          assistant_color?: Database["public"]["Enums"]["assistant_color"]
          assistant_name?: string | null
          assistant_onboarded_at?: string | null
          assistant_shape?: Database["public"]["Enums"]["assistant_shape"]
          booking_days_ahead?: number
          booking_notice_hours?: number
          break_after_minutes?: number
          break_minutes?: number
          btw_number?: string | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          check_in_after_minutes?: number
          city?: string | null
          clock_in_mode?: Database["public"]["Enums"]["clock_in_mode"]
          country?: string
          created_at?: string
          day_ends_at?: string
          deadline_headsup_days?: number
          default_hourly_rate?: number | null
          iban?: string | null
          id: string
          invoice_counter?: number
          invoice_counter_period?: string | null
          invoice_prefix?: string | null
          is_admin?: boolean
          is_starter?: boolean
          kvk_number?: string | null
          meeting_minutes?: number
          name?: string | null
          payment_term_days?: number
          postal_code?: string | null
          reminder_days?: number[]
          street?: string | null
          timezone?: string
          updated_at?: string
          uses_kor?: boolean
          week_target_hours?: number
          workspace_matches_assistant?: boolean
        }
        Update: {
          assistant_color?: Database["public"]["Enums"]["assistant_color"]
          assistant_name?: string | null
          assistant_onboarded_at?: string | null
          assistant_shape?: Database["public"]["Enums"]["assistant_shape"]
          booking_days_ahead?: number
          booking_notice_hours?: number
          break_after_minutes?: number
          break_minutes?: number
          btw_number?: string | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          check_in_after_minutes?: number
          city?: string | null
          clock_in_mode?: Database["public"]["Enums"]["clock_in_mode"]
          country?: string
          created_at?: string
          day_ends_at?: string
          deadline_headsup_days?: number
          default_hourly_rate?: number | null
          iban?: string | null
          id?: string
          invoice_counter?: number
          invoice_counter_period?: string | null
          invoice_prefix?: string | null
          is_admin?: boolean
          is_starter?: boolean
          kvk_number?: string | null
          meeting_minutes?: number
          name?: string | null
          payment_term_days?: number
          postal_code?: string | null
          reminder_days?: number[]
          street?: string | null
          timezone?: string
          updated_at?: string
          uses_kor?: boolean
          week_target_hours?: number
          workspace_matches_assistant?: boolean
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_path: string
          id: string
          name: string
          project_id: string
          shared_with_client: boolean
          size_bytes: number | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          name: string
          project_id: string
          shared_with_client?: boolean
          size_bytes?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          name?: string
          project_id?: string
          shared_with_client?: boolean
          size_bytes?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "project_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          body: string | null
          created_at: string
          id: string
          project_id: string
          title: string
          updated_at: string
          user_id: string
          visible_to_client: boolean
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          project_id: string
          title: string
          updated_at?: string
          user_id?: string
          visible_to_client?: boolean
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string
          user_id?: string
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "project_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          briefing: string | null
          client_id: string | null
          color: string | null
          created_at: string
          deadline: string | null
          id: string
          price: number | null
          price_type: Database["public"]["Enums"]["price_type"]
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          briefing?: string | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          price?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          briefing?: string | null
          client_id?: string | null
          color?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          price?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_user_id_fkey"
            columns: ["client_id", "user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          approved_at: string | null
          contract_id: string | null
          created_at: string
          declined_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          planned_start: string | null
          price: number | null
          project_id: string
          requested_by: string | null
          sent_at: string | null
          signature_data: string | null
          signed_by: string | null
          signed_ip: unknown
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          contract_id?: string | null
          created_at?: string
          declined_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          planned_start?: string | null
          price?: number | null
          project_id: string
          requested_by?: string | null
          sent_at?: string | null
          signature_data?: string | null
          signed_by?: string | null
          signed_ip?: unknown
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          approved_at?: string | null
          contract_id?: string | null
          created_at?: string
          declined_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          planned_start?: string | null
          price?: number | null
          project_id?: string
          requested_by?: string | null
          sent_at?: string | null
          signature_data?: string | null
          signed_by?: string | null
          signed_ip?: unknown
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_contract_id_user_id_fkey"
            columns: ["contract_id", "user_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "requests_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_signed_by_fkey"
            columns: ["signed_by"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: number
          year: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: number
          year: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: number
          year?: number
        }
        Relationships: []
      }
      themes: {
        Row: {
          colors: Json
          created_at: string
          fonts: Json
          id: string
          layout: Json
          template_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          colors?: Json
          created_at?: string
          fonts?: Json
          id?: string
          layout?: Json
          template_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          colors?: Json
          created_at?: string
          fonts?: Json
          id?: string
          layout?: Json
          template_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          agenda_item_id: string | null
          category: Database["public"]["Enums"]["time_category"]
          created_at: string
          ended_at: string | null
          id: string
          invoice_line_id: string | null
          last_active_at: string
          note: string | null
          project_id: string | null
          started_at: string
          started_by: Database["public"]["Enums"]["clock_start_source"]
          stopped_by: Database["public"]["Enums"]["clock_stop_reason"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agenda_item_id?: string | null
          category?: Database["public"]["Enums"]["time_category"]
          created_at?: string
          ended_at?: string | null
          id?: string
          invoice_line_id?: string | null
          last_active_at?: string
          note?: string | null
          project_id?: string | null
          started_at?: string
          started_by?: Database["public"]["Enums"]["clock_start_source"]
          stopped_by?: Database["public"]["Enums"]["clock_stop_reason"] | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          agenda_item_id?: string | null
          category?: Database["public"]["Enums"]["time_category"]
          created_at?: string
          ended_at?: string | null
          id?: string
          invoice_line_id?: string | null
          last_active_at?: string
          note?: string | null
          project_id?: string | null
          started_at?: string
          started_by?: Database["public"]["Enums"]["clock_start_source"]
          stopped_by?: Database["public"]["Enums"]["clock_stop_reason"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_agenda_item_id_user_id_fkey"
            columns: ["agenda_item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "agenda_items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "time_entries_invoice_line_id_user_id_fkey"
            columns: ["invoice_line_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoice_lines"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "time_entries_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      working_hours: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          kind: Database["public"]["Enums"]["working_hours_kind"]
          starts_at: string
          updated_at: string
          user_id: string
          weekday: number
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          kind?: Database["public"]["Enums"]["working_hours_kind"]
          starts_at: string
          updated_at?: string
          user_id?: string
          weekday: number
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["working_hours_kind"]
          starts_at?: string
          updated_at?: string
          user_id?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "working_hours_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      invoice_overview: {
        Row: {
          client_details: Json | null
          client_id: string | null
          created_at: string | null
          credits_invoice_id: string | null
          days_overdue: number | null
          due_date: string | null
          id: string | null
          invoice_number: string | null
          is_overdue: boolean | null
          issue_date: string | null
          issuer_details: Json | null
          last_reminder_at: string | null
          notes: string | null
          paid_at: string | null
          pdf_path: string | null
          project_id: string | null
          reminder_count: number | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
          user_id: string | null
          vat_total: number | null
          vat_treatment: Database["public"]["Enums"]["vat_treatment"] | null
        }
        Insert: {
          client_details?: Json | null
          client_id?: string | null
          created_at?: string | null
          credits_invoice_id?: string | null
          days_overdue?: never
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
          is_overdue?: never
          issue_date?: string | null
          issuer_details?: Json | null
          last_reminder_at?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_path?: string | null
          project_id?: string | null
          reminder_count?: number | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
          vat_total?: number | null
          vat_treatment?: Database["public"]["Enums"]["vat_treatment"] | null
        }
        Update: {
          client_details?: Json | null
          client_id?: string | null
          created_at?: string | null
          credits_invoice_id?: string | null
          days_overdue?: never
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
          is_overdue?: never
          issue_date?: string | null
          issuer_details?: Json | null
          last_reminder_at?: string | null
          notes?: string | null
          paid_at?: string | null
          pdf_path?: string | null
          project_id?: string | null
          reminder_count?: number | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
          vat_total?: number | null
          vat_treatment?: Database["public"]["Enums"]["vat_treatment"] | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_user_id_fkey"
            columns: ["client_id", "user_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_credits_invoice_id_user_id_fkey"
            columns: ["credits_invoice_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoice_overview"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_credits_invoice_id_user_id_fkey"
            columns: ["credits_invoice_id", "user_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_project_id_user_id_fkey"
            columns: ["project_id", "user_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cancel_meeting_request: {
        Args: { p_id: string }
        Returns: {
          agenda_item_id: string | null
          client_account_id: string
          created_at: string
          ends_at: string
          id: string
          message: string | null
          project_id: string
          responded_at: string | null
          starts_at: string
          status: Database["public"]["Enums"]["meeting_request_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "meeting_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      client_create_request: {
        Args: { p_description?: string; p_project_id: string; p_title: string }
        Returns: {
          approved_at: string | null
          contract_id: string | null
          created_at: string
          declined_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          planned_start: string | null
          price: number | null
          project_id: string
          requested_by: string | null
          sent_at: string | null
          signature_data: string | null
          signed_by: string | null
          signed_ip: unknown
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      client_has_project: { Args: { p_project_id: string }; Returns: boolean }
      clock_heartbeat: { Args: never; Returns: undefined }
      clock_in: {
        Args: {
          p_agenda_item_id?: string
          p_category?: Database["public"]["Enums"]["time_category"]
          p_note?: string
          p_project_id?: string
          p_started_by?: Database["public"]["Enums"]["clock_start_source"]
        }
        Returns: {
          agenda_item_id: string | null
          category: Database["public"]["Enums"]["time_category"]
          created_at: string
          ended_at: string | null
          id: string
          invoice_line_id: string | null
          last_active_at: string
          note: string | null
          project_id: string | null
          started_at: string
          started_by: Database["public"]["Enums"]["clock_start_source"]
          stopped_by: Database["public"]["Enums"]["clock_stop_reason"] | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "time_entries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      clock_out: {
        Args: {
          p_at?: string
          p_reason?: Database["public"]["Enums"]["clock_stop_reason"]
        }
        Returns: {
          agenda_item_id: string | null
          category: Database["public"]["Enums"]["time_category"]
          created_at: string
          ended_at: string | null
          id: string
          invoice_line_id: string | null
          last_active_at: string
          note: string | null
          project_id: string | null
          started_at: string
          started_by: Database["public"]["Enums"]["clock_start_source"]
          stopped_by: Database["public"]["Enums"]["clock_stop_reason"] | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "time_entries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_available_slots: {
        Args: { p_days?: number; p_from?: string; p_project_id: string }
        Returns: {
          ends_at: string
          starts_at: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_app_request: { Args: never; Returns: boolean }
      is_freelancer: { Args: never; Returns: boolean }
      link_client_invites: {
        Args: { p_client_account_id: string; p_email: string }
        Returns: undefined
      }
      my_client_account_id: { Args: never; Returns: string }
      portal_projects: {
        Args: never
        Returns: {
          accepted_at: string
          briefing: string
          color: string
          deadline: string
          freelancer_name: string
          last_seen_at: string
          project_id: string
          start_date: string
          status: Database["public"]["Enums"]["project_status"]
          title: string
        }[]
      }
      portal_review_items: {
        Args: { p_project_id: string }
        Returns: {
          client_feedback: string
          client_review_status: Database["public"]["Enums"]["client_review_status"]
          id: string
          review_sent_at: string
          reviewed_at: string
          title: string
        }[]
      }
      portal_touch: { Args: { p_project_id: string }; Returns: undefined }
      request_meeting: {
        Args: { p_message?: string; p_project_id: string; p_starts_at: string }
        Returns: {
          agenda_item_id: string | null
          client_account_id: string
          created_at: string
          ends_at: string
          id: string
          message: string | null
          project_id: string
          responded_at: string | null
          starts_at: string
          status: Database["public"]["Enums"]["meeting_request_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "meeting_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      respond_to_meeting_request: {
        Args: { p_accept: boolean; p_id: string }
        Returns: {
          agenda_item_id: string | null
          client_account_id: string
          created_at: string
          ends_at: string
          id: string
          message: string | null
          project_id: string
          responded_at: string | null
          starts_at: string
          status: Database["public"]["Enums"]["meeting_request_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "meeting_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      respond_to_request: {
        Args: { p_approve: boolean; p_request_id: string; p_signature?: string }
        Returns: {
          approved_at: string | null
          contract_id: string | null
          created_at: string
          declined_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          planned_start: string | null
          price: number | null
          project_id: string
          requested_by: string | null
          sent_at: string | null
          signature_data: string | null
          signed_by: string | null
          signed_ip: unknown
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      respond_to_review: {
        Args: { p_approve: boolean; p_feedback?: string; p_item_id: string }
        Returns: undefined
      }
      sign_contract: {
        Args: { p_contract_id: string; p_signature: string }
        Returns: {
          body: string
          created_at: string
          id: string
          pdf_path: string | null
          project_id: string
          sent_at: string | null
          signature_data: string | null
          signed_at: string | null
          signed_by: string | null
          signed_ip: unknown
          status: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "contracts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      agenda_item_status: "open" | "done"
      agenda_item_type:
        | "meeting"
        | "work"
        | "shoot"
        | "deadline"
        | "rest"
        | "task"
        | "errand"
      agenda_source: "manual" | "system"
      assistant_color: "ink" | "pink" | "blue" | "green" | "orange" | "lilac"
      assistant_shape: "splat" | "bubble" | "star" | "cloud" | "flower"
      board_status: "todo" | "in_progress" | "in_review" | "done"
      business_type: "eenmanszaak" | "bv" | "not_registered" | "abroad"
      client_review_status: "waiting" | "changes_requested" | "approved"
      clock_in_mode: "ask" | "auto" | "off"
      clock_start_source: "manual" | "prompt" | "auto"
      clock_stop_reason: "manual" | "switch" | "no_answer" | "inactive"
      contract_status: "draft" | "sent" | "signed"
      energy_type: "creative" | "admin" | "other"
      invoice_status: "draft" | "sent" | "paid"
      meeting_request_status: "pending" | "accepted" | "declined" | "cancelled"
      moodboard_item_type: "image" | "color" | "text" | "link"
      price_type: "fixed" | "hourly"
      project_status: "draft" | "active" | "done" | "archived"
      request_status: "requested" | "draft" | "sent" | "approved" | "declined"
      task_priority: "must" | "should" | "could" | "wont"
      tile_kind: "app" | "link"
      time_category: "client_work" | "admin" | "acquisition" | "training"
      vat_treatment: "standard" | "kor" | "reverse_charge" | "outside_eu"
      working_hours_kind: "work" | "creative" | "meetings"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agenda_item_status: ["open", "done"],
      agenda_item_type: [
        "meeting",
        "work",
        "shoot",
        "deadline",
        "rest",
        "task",
        "errand",
      ],
      agenda_source: ["manual", "system"],
      assistant_color: ["ink", "pink", "blue", "green", "orange", "lilac"],
      assistant_shape: ["splat", "bubble", "star", "cloud", "flower"],
      board_status: ["todo", "in_progress", "in_review", "done"],
      business_type: ["eenmanszaak", "bv", "not_registered", "abroad"],
      client_review_status: ["waiting", "changes_requested", "approved"],
      clock_in_mode: ["ask", "auto", "off"],
      clock_start_source: ["manual", "prompt", "auto"],
      clock_stop_reason: ["manual", "switch", "no_answer", "inactive"],
      contract_status: ["draft", "sent", "signed"],
      energy_type: ["creative", "admin", "other"],
      invoice_status: ["draft", "sent", "paid"],
      meeting_request_status: ["pending", "accepted", "declined", "cancelled"],
      moodboard_item_type: ["image", "color", "text", "link"],
      price_type: ["fixed", "hourly"],
      project_status: ["draft", "active", "done", "archived"],
      request_status: ["requested", "draft", "sent", "approved", "declined"],
      task_priority: ["must", "should", "could", "wont"],
      tile_kind: ["app", "link"],
      time_category: ["client_work", "admin", "acquisition", "training"],
      vat_treatment: ["standard", "kor", "reverse_charge", "outside_eu"],
      working_hours_kind: ["work", "creative", "meetings"],
    },
  },
} as const

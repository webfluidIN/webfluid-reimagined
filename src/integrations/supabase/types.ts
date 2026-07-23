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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          business_name: string
          city: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          business_name: string
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          business_name?: string
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          position: number
          quantity: number
          unit_price: number
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          position?: number
          quantity?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          position?: number
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          currency: string
          discount: number
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          tax_percent: number
          total: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          currency?: string
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          tax_percent?: number
          total?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          currency?: string
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          tax_percent?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_submissions: {
        Row: {
          admin_notes: string | null
          business_name: string
          client_id: string | null
          created_at: string
          data: Json
          email: string
          full_name: string
          id: string
          logo_storage_path: string | null
          phone: string | null
          services: string[]
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          business_name: string
          client_id?: string | null
          created_at?: string
          data: Json
          email: string
          full_name: string
          id?: string
          logo_storage_path?: string | null
          phone?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          business_name?: string
          client_id?: string | null
          created_at?: string
          data?: Json
          email?: string
          full_name?: string
          id?: string
          logo_storage_path?: string | null
          phone?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_onboarding_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_submissions: {
        Row: {
          admin_notes: string | null
          client_id: string | null
          created_at: string
          data: Json
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          service: string | null
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          client_id?: string | null
          created_at?: string
          data?: Json
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          client_id?: string | null
          created_at?: string
          data?: Json
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_quote_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      renewals: {
        Row: {
          client_id: string
          cost: number | null
          created_at: string
          currency: string | null
          id: string
          label: string
          last_reminded_on: string | null
          notes: string | null
          reminder_days_before: number
          renews_on: string
          status: Database["public"]["Enums"]["renewal_status"]
          type: Database["public"]["Enums"]["renewal_type"]
          updated_at: string
          vendor: string | null
        }
        Insert: {
          client_id: string
          cost?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          label: string
          last_reminded_on?: string | null
          notes?: string | null
          reminder_days_before?: number
          renews_on: string
          status?: Database["public"]["Enums"]["renewal_status"]
          type: Database["public"]["Enums"]["renewal_type"]
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          client_id?: string
          cost?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          label?: string
          last_reminded_on?: string | null
          notes?: string | null
          reminder_days_before?: number
          renews_on?: string
          status?: Database["public"]["Enums"]["renewal_status"]
          type?: Database["public"]["Enums"]["renewal_type"]
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "renewals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "void"
      renewal_status: "active" | "cancelled" | "expired"
      renewal_type:
        | "domain"
        | "hosting"
        | "plugin"
        | "ad_retainer"
        | "ssl"
        | "email"
        | "other"
      submission_status: "new" | "contacted" | "proposal_sent" | "won" | "lost"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "staff"],
      invoice_status: ["draft", "sent", "paid", "overdue", "void"],
      renewal_status: ["active", "cancelled", "expired"],
      renewal_type: [
        "domain",
        "hosting",
        "plugin",
        "ad_retainer",
        "ssl",
        "email",
        "other",
      ],
      submission_status: ["new", "contacted", "proposal_sent", "won", "lost"],
    },
  },
} as const

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
      businesses: {
        Row: {
          accent_color: string
          address: string | null
          country: string | null
          created_at: string
          currency: string
          email: string | null
          headline: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          owner_name: string | null
          phone: string | null
          portal_background: string | null
          primary_color: string
          published: boolean
          saas_plan: string
          setup_step: number
          slug: string
          status: string
          support_email: string | null
          support_phone: string | null
          tagline: string | null
          terms: string | null
        }
        Insert: {
          accent_color?: string
          address?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          owner_name?: string | null
          phone?: string | null
          portal_background?: string | null
          primary_color?: string
          published?: boolean
          saas_plan?: string
          setup_step?: number
          slug: string
          status?: string
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          terms?: string | null
        }
        Update: {
          accent_color?: string
          address?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          headline?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          owner_name?: string | null
          phone?: string | null
          portal_background?: string | null
          primary_color?: string
          published?: boolean
          saas_plan?: string
          setup_step?: number
          slug?: string
          status?: string
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          terms?: string | null
        }
        Relationships: []
      }
      gateway_settings: {
        Row: {
          business_id: string
          config: Json
          enabled: boolean
          id: string
          provider: string
        }
        Insert: {
          business_id: string
          config?: Json
          enabled?: boolean
          id?: string
          provider: string
        }
        Update: {
          business_id?: string
          config?: Json
          enabled?: boolean
          id?: string
          provider?: string
        }
        Relationships: [
          {
            foreignKeyName: "gateway_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          business_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          business_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          business_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          id: string
          phone: string | null
          plan_id: string | null
          provider: string
          reference: string | null
          status: string
        }
        Insert: {
          amount?: number
          business_id: string
          created_at?: string
          id?: string
          phone?: string | null
          plan_id?: string | null
          provider?: string
          reference?: string | null
          status?: string
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          id?: string
          phone?: string | null
          plan_id?: string | null
          provider?: string
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          data_label: string | null
          duration_minutes: number
          id: string
          name: string
          popular: boolean
          price: number
          speed_label: string | null
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          data_label?: string | null
          duration_minutes?: number
          id?: string
          name: string
          popular?: boolean
          price?: number
          speed_label?: string | null
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          data_label?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          popular?: boolean
          price?: number
          speed_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      routers: {
        Row: {
          business_id: string
          created_at: string
          hotspot_network: string | null
          id: string
          last_seen: string | null
          location_id: string | null
          name: string
          radius_secret: string | null
          routeros_version: string | null
          status: string
          tunnel_ip: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          hotspot_network?: string | null
          id?: string
          last_seen?: string | null
          location_id?: string | null
          name: string
          radius_secret?: string | null
          routeros_version?: string | null
          status?: string
          tunnel_ip?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          hotspot_network?: string | null
          id?: string
          last_seen?: string | null
          location_id?: string | null
          name?: string
          radius_secret?: string | null
          routeros_version?: string | null
          status?: string
          tunnel_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          business_id: string
          bytes_used: number
          ended_at: string | null
          id: string
          mac: string | null
          router_id: string | null
          started_at: string
          username: string
        }
        Insert: {
          business_id: string
          bytes_used?: number
          ended_at?: string | null
          id?: string
          mac?: string | null
          router_id?: string | null
          started_at?: string
          username: string
        }
        Update: {
          business_id?: string
          bytes_used?: number
          ended_at?: string | null
          id?: string
          mac?: string | null
          router_id?: string | null
          started_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_router_id_fkey"
            columns: ["router_id"]
            isOneToOne: false
            referencedRelation: "routers"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          business_id: string
          created_at: string
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          business_id: string
          created_at: string
          id: string
          name: string | null
          phone: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          name?: string | null
          phone: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          name?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          business_id: string
          code: string
          created_at: string
          id: string
          plan_id: string | null
          status: string
        }
        Insert: {
          business_id: string
          code: string
          created_at?: string
          id?: string
          plan_id?: string | null
          status?: string
        }
        Update: {
          business_id?: string
          code?: string
          created_at?: string
          id?: string
          plan_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vouchers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
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
      owns_business: { Args: { _business_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "business_owner"
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
      app_role: ["super_admin", "business_owner"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lists: {
        Row: {
          created_at: string | null
          id: number
          name: string
          name_canonical: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          name_canonical: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          name_canonical?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          above_grade: string | null
          air_conditioner: string | null
          apn: string | null
          attorney_on_file: string | null
          bankruptcy_recording_date: string | null
          bathrooms: string | null
          bedrooms: string | null
          building_use_code: string | null
          business_name: string | null
          created_at: string | null
          deed: string | null
          divorce_file_date: string | null
          email_1: string | null
          email_10: string | null
          email_2: string | null
          email_3: string | null
          email_4: string | null
          email_5: string | null
          email_6: string | null
          email_7: string | null
          email_8: string | null
          email_9: string | null
          estimated_value: string | null
          first_name: string | null
          foreclosure_date: string | null
          heating_type: string | null
          id: string
          import_batch_id: string | null
          land_zoning: string | null
          last_name: string | null
          last_sale_price: string | null
          last_sold: string | null
          legal_description: string | null
          lien_recording_date: string | null
          lien_type: string | null
          lists: Json | null
          loan_to_value: string | null
          lot_size: string | null
          mailing_address: string | null
          mailing_city: string | null
          mailing_county: string | null
          mailing_state: string | null
          mailing_vacant: boolean | null
          mailing_zip: string | null
          mailing_zip5: string | null
          mls: string | null
          mortgage_type: string | null
          neighborhood_rating: string | null
          number_of_units: string | null
          open_mortgages: string | null
          owned_since: string | null
          parcel_id: string | null
          personal_representative: string | null
          personal_representative_phone: string | null
          phone_1: string | null
          phone_2: string | null
          phone_3: string | null
          phone_4: string | null
          phone_5: string | null
          phone_status_1: string | null
          phone_status_2: string | null
          phone_status_3: string | null
          phone_status_4: string | null
          phone_status_5: string | null
          phone_tags_1: Json | null
          phone_tags_2: Json | null
          phone_tags_3: Json | null
          phone_tags_4: Json | null
          phone_tags_5: Json | null
          phone_type_1: string | null
          phone_type_2: string | null
          phone_type_3: string | null
          phone_type_4: string | null
          phone_type_5: string | null
          probate_open_date: string | null
          property_address: string | null
          property_city: string | null
          property_county: string | null
          property_state: string | null
          property_vacant: boolean | null
          property_zip: string | null
          property_zip5: string | null
          rental_value: string | null
          source: string | null
          sqft: string | null
          status: string | null
          storeys: string | null
          structure_type: string | null
          tags: Json | null
          tax_auction_date: string | null
          tax_delinquent_value: string | null
          tax_delinquent_year: string | null
          total_taxes: string | null
          updated_at: string | null
          year: string | null
          year_behind_on_taxes: string | null
        }
        Insert: {
          above_grade?: string | null
          air_conditioner?: string | null
          apn?: string | null
          attorney_on_file?: string | null
          bankruptcy_recording_date?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          building_use_code?: string | null
          business_name?: string | null
          created_at?: string | null
          deed?: string | null
          divorce_file_date?: string | null
          email_1?: string | null
          email_10?: string | null
          email_2?: string | null
          email_3?: string | null
          email_4?: string | null
          email_5?: string | null
          email_6?: string | null
          email_7?: string | null
          email_8?: string | null
          email_9?: string | null
          estimated_value?: string | null
          first_name?: string | null
          foreclosure_date?: string | null
          heating_type?: string | null
          id?: string
          import_batch_id?: string | null
          land_zoning?: string | null
          last_name?: string | null
          last_sale_price?: string | null
          last_sold?: string | null
          legal_description?: string | null
          lien_recording_date?: string | null
          lien_type?: string | null
          lists?: Json | null
          loan_to_value?: string | null
          lot_size?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_county?: string | null
          mailing_state?: string | null
          mailing_vacant?: boolean | null
          mailing_zip?: string | null
          mailing_zip5?: string | null
          mls?: string | null
          mortgage_type?: string | null
          neighborhood_rating?: string | null
          number_of_units?: string | null
          open_mortgages?: string | null
          owned_since?: string | null
          parcel_id?: string | null
          personal_representative?: string | null
          personal_representative_phone?: string | null
          phone_1?: string | null
          phone_2?: string | null
          phone_3?: string | null
          phone_4?: string | null
          phone_5?: string | null
          phone_status_1?: string | null
          phone_status_2?: string | null
          phone_status_3?: string | null
          phone_status_4?: string | null
          phone_status_5?: string | null
          phone_tags_1?: Json | null
          phone_tags_2?: Json | null
          phone_tags_3?: Json | null
          phone_tags_4?: Json | null
          phone_tags_5?: Json | null
          phone_type_1?: string | null
          phone_type_2?: string | null
          phone_type_3?: string | null
          phone_type_4?: string | null
          phone_type_5?: string | null
          probate_open_date?: string | null
          property_address?: string | null
          property_city?: string | null
          property_county?: string | null
          property_state?: string | null
          property_vacant?: boolean | null
          property_zip?: string | null
          property_zip5?: string | null
          rental_value?: string | null
          source?: string | null
          sqft?: string | null
          status?: string | null
          storeys?: string | null
          structure_type?: string | null
          tags?: Json | null
          tax_auction_date?: string | null
          tax_delinquent_value?: string | null
          tax_delinquent_year?: string | null
          total_taxes?: string | null
          updated_at?: string | null
          year?: string | null
          year_behind_on_taxes?: string | null
        }
        Update: {
          above_grade?: string | null
          air_conditioner?: string | null
          apn?: string | null
          attorney_on_file?: string | null
          bankruptcy_recording_date?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          building_use_code?: string | null
          business_name?: string | null
          created_at?: string | null
          deed?: string | null
          divorce_file_date?: string | null
          email_1?: string | null
          email_10?: string | null
          email_2?: string | null
          email_3?: string | null
          email_4?: string | null
          email_5?: string | null
          email_6?: string | null
          email_7?: string | null
          email_8?: string | null
          email_9?: string | null
          estimated_value?: string | null
          first_name?: string | null
          foreclosure_date?: string | null
          heating_type?: string | null
          id?: string
          import_batch_id?: string | null
          land_zoning?: string | null
          last_name?: string | null
          last_sale_price?: string | null
          last_sold?: string | null
          legal_description?: string | null
          lien_recording_date?: string | null
          lien_type?: string | null
          lists?: Json | null
          loan_to_value?: string | null
          lot_size?: string | null
          mailing_address?: string | null
          mailing_city?: string | null
          mailing_county?: string | null
          mailing_state?: string | null
          mailing_vacant?: boolean | null
          mailing_zip?: string | null
          mailing_zip5?: string | null
          mls?: string | null
          mortgage_type?: string | null
          neighborhood_rating?: string | null
          number_of_units?: string | null
          open_mortgages?: string | null
          owned_since?: string | null
          parcel_id?: string | null
          personal_representative?: string | null
          personal_representative_phone?: string | null
          phone_1?: string | null
          phone_2?: string | null
          phone_3?: string | null
          phone_4?: string | null
          phone_5?: string | null
          phone_status_1?: string | null
          phone_status_2?: string | null
          phone_status_3?: string | null
          phone_status_4?: string | null
          phone_status_5?: string | null
          phone_tags_1?: Json | null
          phone_tags_2?: Json | null
          phone_tags_3?: Json | null
          phone_tags_4?: Json | null
          phone_tags_5?: Json | null
          phone_type_1?: string | null
          phone_type_2?: string | null
          phone_type_3?: string | null
          phone_type_4?: string | null
          phone_type_5?: string | null
          probate_open_date?: string | null
          property_address?: string | null
          property_city?: string | null
          property_county?: string | null
          property_state?: string | null
          property_vacant?: boolean | null
          property_zip?: string | null
          property_zip5?: string | null
          rental_value?: string | null
          source?: string | null
          sqft?: string | null
          status?: string | null
          storeys?: string | null
          structure_type?: string | null
          tags?: Json | null
          tax_auction_date?: string | null
          tax_delinquent_value?: string | null
          tax_delinquent_year?: string | null
          total_taxes?: string | null
          updated_at?: string | null
          year?: string | null
          year_behind_on_taxes?: string | null
        }
        Relationships: []
      }
      property_lists: {
        Row: {
          list_id: number
          property_id: string
        }
        Insert: {
          list_id: number
          property_id: string
        }
        Update: {
          list_id?: number
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_lists_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_lists_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_scores: {
        Row: {
          configuration_id: string
          created_at: string | null
          details: Json | null
          property_id: string
          score: number
          updated_at: string | null
        }
        Insert: {
          configuration_id: string
          created_at?: string | null
          details?: Json | null
          property_id: string
          score: number
          updated_at?: string | null
        }
        Update: {
          configuration_id?: string
          created_at?: string | null
          details?: Json | null
          property_id?: string
          score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_scores_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "scoring_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_scores_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_tags: {
        Row: {
          property_id: string
          tag_id: number
        }
        Insert: {
          property_id: string
          tag_id: number
        }
        Update: {
          property_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "property_tags_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_configurations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scoring_rules: {
        Row: {
          configuration_id: string
          created_at: string | null
          field_name: string | null
          id: number
          operator: string | null
          rule_name: string
          rule_type: string
          score: number
          updated_at: string | null
          value: string | null
        }
        Insert: {
          configuration_id: string
          created_at?: string | null
          field_name?: string | null
          id?: number
          operator?: string | null
          rule_name: string
          rule_type: string
          score: number
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          configuration_id?: string
          created_at?: string | null
          field_name?: string | null
          id?: number
          operator?: string | null
          rule_name?: string
          rule_type?: string
          score?: number
          updated_at?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scoring_rules_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "scoring_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string | null
          created_at: string | null
          id: number
          name: string
          name_canonical: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: number
          name: string
          name_canonical: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: number
          name?: string
          name_canonical?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      safe_to_jsonb_array: {
        Args: {
          input_value: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          id: string
          user_id: string
          match_info: string
          odds: number
          amount: number
          status: 'pending' | 'won' | 'lost'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          match_info: string
          odds: number
          amount: number
          status?: 'pending' | 'won' | 'lost'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          match_info?: string
          odds?: number
          amount?: number
          status?: 'pending' | 'won' | 'lost'
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          created_at?: string
        }
      }
    }
  }
}

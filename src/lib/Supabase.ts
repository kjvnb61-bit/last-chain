import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  balance: number;
  streak: number;
  last_checkin: string | null;
  wallet_address: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskHistory {
  id: string;
  user_id: string;
  task_name: string;
  points: number;
  completed_at: string;
}

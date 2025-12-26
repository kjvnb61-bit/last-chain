import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tkltwvyqpgnhstutugqg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbHR3dnlxcGduaHN0dXR1Z3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTc4NjcsImV4cCI6MjA4MjMzMzg2N30.UeI9p0dlTMFt7uvJcw-frEIHfCA-Lz-iEkO1yCM_9DM";

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

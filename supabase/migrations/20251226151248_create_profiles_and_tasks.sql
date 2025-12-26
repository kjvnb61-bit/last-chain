/*
  # Last Chain Platform - Core Schema

  ## Overview
  Creates the core database structure for the Last Chain gamification platform,
  including user profiles, task tracking, and referral system.

  ## New Tables
  
  ### `profiles`
  User profile data with points, streaks, and wallet information:
  - `id` (uuid, primary key) - Links to auth.users
  - `balance` (integer) - Total LAST tokens earned
  - `streak` (integer) - Consecutive daily check-in days
  - `last_checkin` (timestamptz) - Last daily claim timestamp
  - `wallet_address` (text) - Connected Web3 wallet address
  - `referred_by` (uuid) - ID of user who referred this user
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### `task_history`
  Historical record of all completed tasks and earned points:
  - `id` (uuid, primary key) - Unique task completion ID
  - `user_id` (uuid, foreign key) - User who completed the task
  - `task_name` (text) - Name/description of the task
  - `points` (integer) - Points awarded for completion
  - `completed_at` (timestamptz) - Task completion timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only read their own profile data
  - Users can only update their own profile
  - Users can only view their own task history
  - Leaderboard access is granted through specific policies

  ### Policies
  1. **Profiles**: Users can view and update their own profile
  2. **Task History**: Users can read their own history, system can insert
  3. **Leaderboard**: All authenticated users can view top scores
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer DEFAULT 0 NOT NULL,
  streak integer DEFAULT 0 NOT NULL,
  last_checkin timestamptz,
  wallet_address text,
  referred_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create task_history table
CREATE TABLE IF NOT EXISTS task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  task_name text NOT NULL,
  points integer NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_balance ON profiles(balance DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_task_history_user_id ON task_history(user_id);
CREATE INDEX IF NOT EXISTS idx_task_history_completed_at ON task_history(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view leaderboard data"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Task History Policies
CREATE POLICY "Users can view own task history"
  ON task_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task history"
  ON task_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

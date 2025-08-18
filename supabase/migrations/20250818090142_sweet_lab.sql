/*
  # Create wellness_goals table

  1. New Tables
    - `wellness_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, goal title)
      - `description` (text, optional description)
      - `category` (text, goal category)
      - `target_value` (integer, target to achieve)
      - `current_value` (integer, current progress)
      - `unit` (text, unit of measurement)
      - `deadline` (date, optional deadline)
      - `status` (text, active/completed/paused)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `wellness_goals` table
    - Add policies for users to manage their own wellness goals
*/

CREATE TABLE IF NOT EXISTS public.wellness_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  target_value INTEGER NOT NULL DEFAULT 1,
  current_value INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'times',
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wellness_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wellness_goals
CREATE POLICY "Users can view their own wellness goals" ON public.wellness_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wellness goals" ON public.wellness_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness goals" ON public.wellness_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness goals" ON public.wellness_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wellness_goals_updated_at
  BEFORE UPDATE ON public.wellness_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_wellness_goals_user_status ON public.wellness_goals(user_id, status);
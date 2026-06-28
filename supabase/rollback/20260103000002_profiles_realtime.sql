-- Rollback: 20260103000002_profiles_realtime.sql

alter publication supabase_realtime drop table if exists public.profiles;

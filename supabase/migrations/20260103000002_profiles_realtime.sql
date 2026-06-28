-- Enable Realtime for profile updates (avatar, display name, bio).

alter publication supabase_realtime add table public.profiles;

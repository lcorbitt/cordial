-- Rollback: 20260103000001_notifications.sql

alter publication supabase_realtime drop table if exists public.notifications;

drop table if exists public.notifications cascade;

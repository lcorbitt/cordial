-- In-app notifications.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_created_at_idx
  on public.notifications (user_id, created_at desc);

create index notifications_unread_user_id_idx
  on public.notifications (user_id)
  where read_at is null;

alter table public.notifications enable row level security;

alter publication supabase_realtime add table public.notifications;

create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = (select auth.uid()));

create policy "notifications_update_own"
  on public.notifications for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

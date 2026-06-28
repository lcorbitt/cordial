-- Rollback: 20260103000003_unique_display_names.sql

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_role_id uuid;
begin
  insert into public.profiles (owner_id, display_name)
  values (new.id, split_part(coalesce(new.email, ''), '@', 1));

  select id into member_role_id
  from public.roles
  where slug = 'member'
  limit 1;

  if member_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (new.id, member_role_id)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop function if exists public.is_display_name_taken(text, uuid);

drop index if exists public.profiles_display_name_unique_idx;

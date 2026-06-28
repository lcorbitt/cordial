-- Globally unique display names (case-insensitive, trimmed). Applies platform-wide,
-- not per community.

-- Resolve any existing duplicates before adding the unique index.
with ranked as (
  select
    id,
    row_number() over (
      partition by lower(trim(display_name))
      order by created_at
    ) as rn
  from public.profiles
  where display_name is not null
    and trim(display_name) <> ''
    and deleted_at is null
)
update public.profiles p
set display_name = p.display_name || '-' || substr(replace(p.owner_id::text, '-', ''), 1, 6)
from ranked r
where p.id = r.id
  and r.rn > 1;

create unique index profiles_display_name_unique_idx
  on public.profiles (lower(trim(display_name)))
  where display_name is not null
    and trim(display_name) <> ''
    and deleted_at is null;

create or replace function public.is_display_name_taken(
  p_display_name text,
  p_exclude_owner_id uuid default null
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where deleted_at is null
      and display_name is not null
      and trim(display_name) <> ''
      and lower(trim(display_name)) = lower(trim(p_display_name))
      and (p_exclude_owner_id is null or owner_id <> p_exclude_owner_id)
  );
$$;

revoke all on function public.is_display_name_taken(text, uuid) from public;
grant execute on function public.is_display_name_taken(text, uuid) to service_role;

-- Auto-assigned signup names must not violate uniqueness.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_role_id uuid;
  candidate_name text;
  suffix text;
begin
  candidate_name := trim(split_part(coalesce(new.email, ''), '@', 1));

  if candidate_name = '' then
    candidate_name := 'user';
  end if;

  if public.is_display_name_taken(candidate_name, null) then
    suffix := substr(replace(new.id::text, '-', ''), 1, 6);
    candidate_name := candidate_name || '-' || suffix;
  end if;

  insert into public.profiles (owner_id, display_name)
  values (new.id, candidate_name);

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

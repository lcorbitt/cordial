-- Seed data for local development and testing.
-- Safe to run repeatedly via `npm run db:reset`.
--
-- WARNING: The test users below are for LOCAL/DEV ONLY. They use a well-known
-- password and must never exist in staging or production.

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
insert into public.roles (name, slug, scope, is_system) values
  ('Member', 'member', 'system', true),
  ('Moderator', 'moderator', 'system', true),
  ('Admin', 'admin', 'system', true),
  ('Super Admin', 'super_admin', 'system', true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Permissions (resource:action)
-- ---------------------------------------------------------------------------
insert into public.permissions (resource, action, description) values
  ('users', 'read', 'View user profiles'),
  ('users', 'manage', 'Create, update, or remove users'),
  ('flags', 'read', 'View feature flags'),
  ('flags', 'manage', 'Create and update feature flags'),
  ('audit', 'read', 'Read audit logs'),
  ('admin', 'access', 'Access the admin area'),
  ('communities', 'read', 'View all communities in admin'),
  ('communities', 'manage', 'Create communities and send invites')
on conflict (resource, action) do nothing;

-- ---------------------------------------------------------------------------
-- Role -> permission grants
-- ---------------------------------------------------------------------------
-- Moderator: read users.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (p.resource, p.action) in (('users', 'read'))
where r.slug = 'moderator'
on conflict do nothing;

-- Admin: full admin area plus user and flag management.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p
  on (p.resource, p.action) in (
    ('users', 'read'),
    ('users', 'manage'),
    ('flags', 'read'),
    ('flags', 'manage'),
    ('audit', 'read'),
    ('admin', 'access'),
    ('communities', 'read'),
    ('communities', 'manage')
  )
where r.slug = 'admin'
on conflict do nothing;

-- Super Admin: every permission.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug = 'super_admin'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Feature flags
-- ---------------------------------------------------------------------------
insert into public.feature_flags
  (key, description, type, default_value, rollout_percentage, environments, is_active)
values
  ('new-dashboard', 'Redesigned dashboard', 'boolean', false, 0,
    '{"local": true, "development": true}'::jsonb, true),
  ('beta-search', 'Percentage rollout of beta search', 'percentage', false, 25,
    '{}'::jsonb, true)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Sample community (stub)
-- ---------------------------------------------------------------------------
insert into public.communities (name, slug)
values ('Cordial HQ', 'cordial-hq')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Local test users (LOCAL/DEV ONLY)
-- ---------------------------------------------------------------------------
-- Password for all: "password123"
do $$
declare
  member_user_id uuid := '11111111-1111-1111-1111-111111111111';
  admin_user_id uuid := '22222222-2222-2222-2222-222222222222';
  lukas_user_id uuid := '33333333-3333-3333-3333-333333333333';
  sharon_user_id uuid := '44444444-4444-4444-4444-444444444444';
  admin_role_id uuid;
  super_admin_role_id uuid;
begin
  -- member@local.test
  if not exists (select 1 from auth.users where id = member_user_id) then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', member_user_id,
      'authenticated', 'authenticated', 'member@local.test',
      extensions.crypt('password123', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), member_user_id, member_user_id,
      format('{"sub":"%s","email":"member@local.test"}', member_user_id)::jsonb,
      'email', now(), now(), now()
    );
  end if;

  -- admin@local.test
  if not exists (select 1 from auth.users where id = admin_user_id) then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', admin_user_id,
      'authenticated', 'authenticated', 'admin@local.test',
      extensions.crypt('password123', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), admin_user_id, admin_user_id,
      format('{"sub":"%s","email":"admin@local.test"}', admin_user_id)::jsonb,
      'email', now(), now(), now()
    );
  end if;

  -- Grant the admin role to admin@local.test (member role is auto-assigned by
  -- the handle_new_user trigger).
  select id into admin_role_id from public.roles where slug = 'admin';
  if admin_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (admin_user_id, admin_role_id)
    on conflict do nothing;
  end if;

  -- lukas@local.test (super_admin)
  if not exists (select 1 from auth.users where id = lukas_user_id) then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', lukas_user_id,
      'authenticated', 'authenticated', 'lukas@local.test',
      extensions.crypt('password123', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), lukas_user_id, lukas_user_id,
      format('{"sub":"%s","email":"lukas@local.test"}', lukas_user_id)::jsonb,
      'email', now(), now(), now()
    );
  end if;

  -- sharon@local.test (super_admin)
  if not exists (select 1 from auth.users where id = sharon_user_id) then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', sharon_user_id,
      'authenticated', 'authenticated', 'sharon@local.test',
      extensions.crypt('password123', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), sharon_user_id, sharon_user_id,
      format('{"sub":"%s","email":"sharon@local.test"}', sharon_user_id)::jsonb,
      'email', now(), now(), now()
    );
  end if;

  select id into super_admin_role_id from public.roles where slug = 'super_admin';
  if super_admin_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values
      (lukas_user_id, super_admin_role_id),
      (sharon_user_id, super_admin_role_id)
    on conflict do nothing;
  end if;
end $$;

-- Assign all local test users to the sample community (after auth.users exist).
insert into public.community_members (community_id, user_id, role_id)
select c.id, u.user_id, r.id
from public.communities c
cross join (
  values
    ('11111111-1111-1111-1111-111111111111'::uuid),
    ('22222222-2222-2222-2222-222222222222'::uuid),
    ('33333333-3333-3333-3333-333333333333'::uuid),
    ('44444444-4444-4444-4444-444444444444'::uuid)
) as u(user_id)
join public.roles r on r.slug = 'member'
where c.slug = 'cordial-hq'
on conflict (community_id, user_id) do nothing;

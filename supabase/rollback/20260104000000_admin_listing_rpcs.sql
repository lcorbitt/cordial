revoke all on function public.list_admin_users_page(
  integer, integer, text, text, text, boolean
) from service_role;
drop function if exists public.list_admin_users_page(
  integer, integer, text, text, text, boolean
);

revoke all on function public.list_admin_community_members_page(
  integer, integer, text, text, text, uuid, boolean
) from service_role;
drop function if exists public.list_admin_community_members_page(
  integer, integer, text, text, text, uuid, boolean
);

revoke all on function public.get_auth_user_emails_by_ids(uuid[]) from service_role;
drop function if exists public.get_auth_user_emails_by_ids(uuid[]);

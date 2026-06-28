-- Rollback: 20260103000000_storage.sql

drop policy if exists "avatars_delete_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_public_read" on storage.objects;

delete from storage.buckets where id = 'avatars';

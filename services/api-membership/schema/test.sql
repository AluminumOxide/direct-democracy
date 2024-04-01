-- test data
DELETE FROM membership;
INSERT INTO membership (id, democracy_id, profile_id, is_verified) SELECT (data->>'id')::uuid, (data->>'democracy_id')::uuid, (data->>'profile_id')::uuid, (data->>'is_verified')::boolean FROM tempmembership ON CONFLICT (id) DO UPDATE SET democracy_id = EXCLUDED.democracy_id, profile_id = EXCLUDED.profile_id, is_verified = EXCLUDED.is_verified;

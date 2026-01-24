-- test data
DELETE FROM membership;
INSERT INTO membership (id, democracy_id, profile_id, is_verified, is_verifying) SELECT (data->>'id')::uuid, (data->>'democracy_id')::uuid, (data->>'profile_id')::uuid, (data->>'is_verified')::boolean, (data->>'is_verifying')::boolean  FROM tempmembership ON CONFLICT (id) DO UPDATE SET democracy_id = EXCLUDED.democracy_id, profile_id = EXCLUDED.profile_id, is_verified = EXCLUDED.is_verified, is_verifying = EXCLUDED.is_verifying;

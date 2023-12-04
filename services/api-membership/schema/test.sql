-- test data
INSERT INTO membership (id, democracy_id, profile_id, is_verified) SELECT (data->>'id')::uuid, (data->>'democracy_id')::uuid, (data->>'profile_id')::uuid, (data->>'is_verified')::boolean FROM tempmembership;

INSERT INTO profile (id, auth_zkpp, auth_salt, auth_public, auth_private, auth_token, auth_expiry) (SELECT (data->>'id')::uuid, data->>'auth_zkpp', data->>'auth_salt', data->>'auth_public', data->>'auth_private', data->>'auth_token', (data->>'auth_expiry')::timestamp FROM tempprofile);
DELETE FROM token;
INSERT INTO TOKEN(id, bucket, token) (SELECT (data->>'id')::uuid, (data->>'bucket')::buckets, data->>'token' FROM temptoken);

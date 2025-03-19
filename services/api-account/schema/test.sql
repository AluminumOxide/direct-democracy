DELETE FROM account;
INSERT INTO account (id, email, auth_zkpp, auth_salt, auth_public, auth_private, encrypted_question, encrypted_profile, is_verified) (SELECT (data->>'id')::uuid, data->>'email', data->>'auth_zkpp', data->>'auth_salt', data->>'auth_public', data->>'auth_private', data->>'encrypted_question', data->>'encrypted_profile', (data->>'is_verified')::boolean FROM tempaccount);
DELETE FROM token;
INSERT INTO TOKEN(id, bucket, token) (SELECT (data->>'id')::uuid, (data->>'bucket')::buckets, data->>'token' FROM temptoken);

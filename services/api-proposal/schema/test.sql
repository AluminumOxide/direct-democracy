-- test data

INSERT INTO proposal (id, democracy_id, membership_id, name, description, target, changes, votable, passed, date_created) SELECT (data->>'id')::uuid, (data->>'democracy_id')::uuid, (data->>'membership_id')::uuid, data->>'name', data->>'description', data->>'target', (data->>'changes')::jsonb, (data->>'votable')::boolean, (data->>'passed')::boolean, (data->>'date_created')::timestamp FROM tempproposal;

INSERT INTO ballot (id, proposal_id, membership_id, is_approved, is_verified, comments, modifiable) SELECT (data->>'id')::uuid, (data->>'proposal_id')::uuid, (data->>'membership_id')::uuid, (data->>'is_approved')::boolean, (data->>'is_verified')::boolean, data->>'comments', (data->>'modifiable')::boolean FROM tempballot;

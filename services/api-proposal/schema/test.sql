-- test data

DELETE FROM ballot;
DELETE FROM proposal;

INSERT INTO proposal (id, democracy_id, membership_id, name, description, target, changes, votable, passed, date_created) SELECT (data->>'id')::uuid, (data->>'democracy_id')::uuid, (data->>'membership_id')::uuid, data->>'name', data->>'description', data->>'target', (data->>'changes')::jsonb, (data->>'votable')::boolean, (data->>'passed')::boolean, (data->>'date_created')::timestamp FROM tempproposal ON CONFLICT (id) DO UPDATE SET democracy_id = EXCLUDED.democracy_id, membership_id = EXCLUDED.membership_id, name = EXCLUDED.name, description = EXCLUDED.description, target = EXCLUDED.target, changes = EXCLUDED.changes, votable = EXCLUDED.votable, passed = EXCLUDED.passed, date_created = EXCLUDED.date_created;

INSERT INTO ballot (id, proposal_id, membership_id, is_approved, is_verified, comments, modifiable) SELECT (data->>'id')::uuid, (data->>'proposal_id')::uuid, (data->>'membership_id')::uuid, (data->>'is_approved')::boolean, (data->>'is_verified')::boolean, data->>'comments', (data->>'modifiable')::boolean FROM tempballot ON CONFLICT (id) DO UPDATE SET proposal_id = EXCLUDED.proposal_id, membership_id = EXCLUDED.membership_id, is_approved = EXCLUDED.is_approved, is_verified = EXCLUDED.is_verified, comments = EXCLUDED.comments, modifiable = EXCLUDED.modifiable;

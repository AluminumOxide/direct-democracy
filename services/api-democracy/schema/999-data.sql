-- test data

INSERT INTO democracy (id, name, description, conduct, content, metas, parent_id) SELECT (data->>'id')::uuid, data->>'name', data->>'description', (data->>'conduct')::jsonb, (data->>'content')::jsonb, (data->>'metas')::jsonb, (data->>'parent_id')::uuid FROM tempdemocracy;


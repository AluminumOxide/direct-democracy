-- test data

INSERT INTO democracy(id, name, description, rules, metas) VALUES('a062d797-8b6a-499c-9d8b-9a0cdf0871bf','Earth', 'Everyone', '{"democracies": {},"rules": {"approval_percent_minimum": "(approved_votes/democracy_population)*100 >= value ","approval_number_minimum": "approved_votes >= value"}}','{"rules": {"democracies": {"add": {"approval_number_minimum":5},"update": {"approval_percent_minimum":75},"delete": {"approval_percent_minimum":100}},"rules": {"add": {"approval_percent_minimum":75},"update": {"approval_percent_minimum":75},"delete": {"approval_percent_minimum":75}}},"metas": {"add": {"approval_percent_minimum":75},"update": {"approval_percent_minimum":75},"delete": {"approval_percent_minimum":75}}}');

INSERT INTO democracy (id, name, description, rules, metas, parent_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59','Test','test','{"a":"b", "c":"d"}','{"rules":{ "add": { "approval_percent_minimum":60 }, "update":{ "approval_percent_minimum":60 }, "delete":{ "approval_percent_minimum":60 }}, "metas":{ "add": { "approval_percent_minimum":80 }, "update":{ "approval_percent_minimum":80 }, "delete":{ "approval_percent_minimum":80 }}}', (SELECT id FROM democracy WHERE parent_id IS NULL LIMIT 1));

INSERT INTO membership (id, democracy_id) VALUES ('02093c31-b520-40f5-99f7-7c43f8bffba8', 'a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');
INSERT INTO membership (democracy_id) VALUES ('a062d797-8b6a-499c-9d8b-9a0cdf0871bf');

INSERT INTO membership (id, democracy_id) VALUES ('0d206021-7988-4ec1-805b-94560a8a0624', '51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');
INSERT INTO membership (democracy_id) VALUES ('51a9a676-3b1e-47eb-845b-2784ccdd1d59');

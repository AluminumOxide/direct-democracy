CREATE TABLE base (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	date_created TIMESTAMP NOT NULL DEFAULT NOW(),
	date_updated TIMESTAMP
);


CREATE TABLE account( LIKE base INCLUDING ALL );

ALTER TABLE account ADD COLUMN email VARCHAR UNIQUE NOT NULL;
ALTER TABLE account ADD COLUMN email_token VARCHAR;

ALTER TABLE account ADD COLUMN auth_zkpp VARCHAR NOT NULL;
ALTER TABLE account ADD COLUMN auth_salt VARCHAR NOT NULL;
ALTER TABLE account ADD COLUMN auth_public VARCHAR;
ALTER TABLE account ADD COLUMN auth_private VARCHAR;

ALTER TABLE account ADD COLUMN encrypted_question VARCHAR NOT NULL;
ALTER TABLE account ADD COLUMN encrypted_profile VARCHAR;

ALTER TABLE account ADD COLUMN is_verified BOOLEAN;

CREATE TRIGGER account_update BEFORE UPDATE ON account FOR EACH ROW EXECUTE PROCEDURE date_updated();


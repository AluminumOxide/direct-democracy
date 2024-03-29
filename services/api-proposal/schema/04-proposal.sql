CREATE TABLE proposal( LIKE base INCLUDING ALL );

ALTER TABLE proposal ADD COLUMN democracy_id UUID;
ALTER TABLE proposal ADD COLUMN membership_id UUID;
ALTER TABLE proposal ADD COLUMN name VARCHAR;
ALTER TABLE proposal ADD COLUMN description VARCHAR;
ALTER TABLE proposal ADD COLUMN target VARCHAR;
ALTER TABLE proposal ADD COLUMN changes JSONB;
ALTER TABLE proposal ADD COLUMN votable BOOLEAN DEFAULT TRUE;
ALTER TABLE proposal ADD COLUMN passed BOOLEAN DEFAULT NULL;

CREATE TRIGGER proposal_update BEFORE UPDATE ON proposal FOR EACH ROW EXECUTE PROCEDURE date_updated();

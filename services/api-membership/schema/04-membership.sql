CREATE TABLE membership( LIKE base INCLUDING ALL );

ALTER TABLE membership ADD COLUMN democracy_id UUID;
ALTER TABLE membership ADD COLUMN profile_id UUID;
ALTER TABLE membership ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;

CREATE TRIGGER membership_update BEFORE UPDATE ON membership FOR EACH ROW EXECUTE PROCEDURE date_updated();
CREATE TRIGGER membership_insert AFTER INSERT ON membership FOR EACH ROW EXECUTE PROCEDURE population_inserted();
CREATE TRIGGER membership_delete BEFORE DELETE ON membership FOR EACH ROW EXECUTE PROCEDURE population_deleted();

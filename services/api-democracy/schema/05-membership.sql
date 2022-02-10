CREATE TABLE membership( LIKE base INCLUDING ALL );

ALTER TABLE membership ADD COLUMN democracy_id UUID;

CREATE TRIGGER membership_update BEFORE UPDATE ON membership FOR EACH ROW EXECUTE PROCEDURE date_updated();

ALTER TABLE membership ADD CONSTRAINT membership_fk_democracy FOREIGN KEY (democracy_id) REFERENCES democracy (id);

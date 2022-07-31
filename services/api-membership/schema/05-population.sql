CREATE TABLE population();

ALTER TABLE population ADD COLUMN democracy_id UUID UNIQUE;
ALTER TABLE population ADD COLUMN population INT;
ALTER TABLE population ADD COLUMN date_updated TIMESTAMP NOT NULL DEFAULT NOW();

CREATE TRIGGER population_update BEFORE UPDATE ON population FOR EACH ROW EXECUTE PROCEDURE date_updated();

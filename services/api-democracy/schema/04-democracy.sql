CREATE TABLE democracy( LIKE base INCLUDING ALL );

ALTER TABLE democracy ADD COLUMN parent_id UUID;
ALTER TABLE democracy ADD COLUMN democracy_name VARCHAR;
ALTER TABLE democracy ADD COLUMN democracy_description VARCHAR;
ALTER TABLE democracy ADD COLUMN population_verified INTEGER DEFAULT 0;
ALTER TABLE democracy ADD COLUMN population_unverified INTEGER DEFAULT 0;
ALTER TABLE democracy ADD COLUMN democracy_conduct JSONB;
ALTER TABLE democracy ADD COLUMN democracy_content JSONB;
ALTER TABLE democracy ADD COLUMN democracy_metas JSONB;

CREATE TRIGGER democracy_update BEFORE UPDATE ON democracy FOR EACH ROW EXECUTE PROCEDURE date_updated();
ALTER TABLE democracy ADD CONSTRAINT democracy_fk_parent FOREIGN KEY (parent_id) REFERENCES democracy (id);


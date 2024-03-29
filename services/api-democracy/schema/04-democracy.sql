CREATE TABLE democracy( LIKE base INCLUDING ALL );

ALTER TABLE democracy ADD COLUMN parent_id UUID;
ALTER TABLE democracy ADD COLUMN name VARCHAR;
ALTER TABLE democracy ADD COLUMN description VARCHAR;
ALTER TABLE democracy ADD COLUMN population_verified INTEGER DEFAULT 0;
ALTER TABLE democracy ADD COLUMN population_unverified INTEGER DEFAULT 0;
ALTER TABLE democracy ADD COLUMN conduct JSONB;
ALTER TABLE democracy ADD COLUMN content JSONB;
ALTER TABLE democracy ADD COLUMN metas JSONB;

CREATE TRIGGER democracy_update BEFORE UPDATE ON democracy FOR EACH ROW EXECUTE PROCEDURE date_updated();
ALTER TABLE democracy ADD CONSTRAINT democracy_fk_parent FOREIGN KEY (parent_id) REFERENCES democracy (id);


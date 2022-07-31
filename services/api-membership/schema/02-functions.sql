CREATE OR REPLACE FUNCTION date_updated()
	RETURNS TRIGGER
AS $$
BEGIN
	NEW.date_updated := NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION population_inserted()
	RETURNS TRIGGER
AS $$
BEGIN
	INSERT INTO population(democracy_id, population) VALUES(NEW.democracy_id, 1) 
		ON CONFLICT(democracy_id) DO 
			UPDATE SET population = population.population + 1 WHERE population.democracy_id = NEW.democracy_id;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION population_deleted()
	RETURNS TRIGGER
AS $$
BEGIN
	UPDATE population SET population = population - 1 WHERE population.democracy_id = OLD.democracy_id;
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

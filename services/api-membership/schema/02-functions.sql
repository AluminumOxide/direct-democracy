CREATE OR REPLACE FUNCTION date_updated()
	RETURNS TRIGGER
AS $$
BEGIN
	NEW.date_updated := NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

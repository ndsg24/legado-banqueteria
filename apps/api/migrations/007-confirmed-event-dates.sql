-- The date survives the retention period of the customer's quote.
LOCK TABLE quotes IN SHARE ROW EXCLUSIVE MODE;
CREATE TABLE confirmed_event_dates (event_date date PRIMARY KEY);

DO $$
DECLARE
  duplicate_days text;
BEGIN
  SELECT string_agg(day::text, ', ' ORDER BY day) INTO duplicate_days
  FROM (
    SELECT (payload->>'date')::date AS day
    FROM quotes WHERE status = 'confirmed'
    GROUP BY 1 HAVING count(*) > 1
  ) conflicts;

  IF duplicate_days IS NOT NULL THEN
    RAISE EXCEPTION 'Multiple confirmed events for dates: %', duplicate_days
      USING HINT = 'Review the conflicting quotes and retain one confirmation per day before retrying.';
  END IF;
END;
$$;

INSERT INTO confirmed_event_dates(event_date)
SELECT (payload->>'date')::date FROM quotes WHERE status = 'confirmed';

CREATE FUNCTION synchronize_confirmed_event_date() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = NEW.status AND OLD.payload->>'date' = NEW.payload->>'date' THEN
      RETURN NULL;
    END IF;
    IF OLD.status = 'confirmed' THEN
      DELETE FROM confirmed_event_dates WHERE event_date = (OLD.payload->>'date')::date;
    END IF;
  END IF;

  IF NEW.status = 'confirmed' THEN
    INSERT INTO confirmed_event_dates(event_date) VALUES ((NEW.payload->>'date')::date);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reserve_event_date
AFTER INSERT OR UPDATE OF status, payload ON quotes
FOR EACH ROW EXECUTE FUNCTION synchronize_confirmed_event_date();

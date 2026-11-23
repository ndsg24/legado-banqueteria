ALTER TABLE financial_movements ADD COLUMN event_reference bigint;
UPDATE financial_movements SET event_reference = quote_number;
CREATE INDEX financial_movements_event_reference_idx ON financial_movements(event_reference);

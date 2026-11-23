ALTER TABLE quotes
  ADD COLUMN status text NOT NULL DEFAULT 'requested'
  CHECK (status IN ('requested', 'confirmed', 'cancelled'));

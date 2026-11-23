CREATE TABLE financial_movements (
  id uuid PRIMARY KEY,
  booked_on date NOT NULL,
  category text NOT NULL CHECK (category IN ('sale','deposit','payment','supplies','staff','rentals','transport','otherExpense')),
  amount integer NOT NULL CHECK (amount BETWEEN 1 AND 999999999),
  quote_number bigint REFERENCES quotes(number) ON DELETE SET NULL
);
CREATE INDEX financial_movements_date_idx ON financial_movements(booked_on DESC,id DESC);
CREATE INDEX financial_movements_quote_idx ON financial_movements(quote_number);

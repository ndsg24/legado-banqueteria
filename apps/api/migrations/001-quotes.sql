CREATE TABLE quotes (
  request_id uuid PRIMARY KEY,
  number bigint GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
  received_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payload jsonb NOT NULL
);
CREATE INDEX quotes_received_at_idx ON quotes(received_at);

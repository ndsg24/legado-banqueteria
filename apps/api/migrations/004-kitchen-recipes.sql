CREATE TABLE kitchen_recipes (
  dish_id text PRIMARY KEY,
  revision integer NOT NULL CHECK (revision > 0),
  lines jsonb NOT NULL CHECK (jsonb_typeof(lines) = 'array')
);

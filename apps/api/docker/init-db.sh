#!/bin/sh
set -eu
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set=app_password="$APP_DB_PASSWORD" <<'SQL'
CREATE ROLE legado_app LOGIN PASSWORD :'app_password';
CREATE SCHEMA AUTHORIZATION legado_app;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SQL

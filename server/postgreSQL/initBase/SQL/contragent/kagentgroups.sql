DROP SEQUENCE IF EXISTS treedoc_key_primary; -- основной первичный
CREATE SEQUENCE IF NOT EXISTS treedoc_key_primary;
id BIGINT NOT NULL PRIMARY KEY default nextval('treedoc_key_primary'),  -- свой счетчик


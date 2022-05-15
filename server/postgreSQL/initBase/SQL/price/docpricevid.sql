DROP TABLE IF EXISTS docpricevid CASCADE;
CREATE TABLE IF NOT EXISTS docpricevid (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" CITEXT NOT NULL UNIQUE,
    "desciption" CITEXT DEFAULT '',
    "meta" jsonb NOT NULL default '{}'::jsonb,
    "user_id" BIGINT DEFAULT NULL,
    "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE docpricevid IS 'Вид документа изменения цен.';
COMMENT ON COLUMN docpricevid.name IS 'Наименование';
INSERT INTO docpricevid(name)
VALUES ('Доп.соглашение');
INSERT INTO docpricevid(name)
VALUES ('Договор');
INSERT INTO docpricevid(name)
VALUES ('Зов души');
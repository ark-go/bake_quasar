DROP TABLE IF EXISTS docprice CASCADE;
CREATE TABLE IF NOT EXISTS docprice (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "docpricevid_id" BIGINT NOT NULL,
    "docnum" CITEXT NOT NULL,
    "name" CITEXT NOT NULL default '',
    "kagent_tm_id" BIGINT NOT NULL,
    -- контрагент только из контрагентов привязаных к торговой марке
    "datestart" TIMESTAMPTZ NOT NULL,
    "description" CITEXT DEFAULT '',
    "meta" jsonb NOT NULL default '{}'::jsonb,
    "user_id" BIGINT DEFAULT NULL,
    "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (docpricevid_id) REFERENCES docpricevid (id),
    FOREIGN KEY (kagent_tm_id) REFERENCES kagent_tm (id) --! изменил здесь а надо в базе
);
CREATE UNIQUE INDEX "IDX_docprice_kagent_docnum" ON docprice (kagent_tm_id, docnum);
-- номер у контрагента уникальный
COMMENT ON TABLE docprice IS 'Документ для изменения цен.';
COMMENT ON COLUMN docprice.name IS 'Наименование документа';
COMMENT ON COLUMN docprice.kagent_tm_id IS 'Контрагенты торговых сетей';
COMMENT ON COLUMN docprice.docpricevid_id IS 'Виды документов';
COMMENT ON COLUMN docprice.datestart IS 'Начало действия цен';
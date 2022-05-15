DROP TABLE IF EXISTS docbakery CASCADE;
CREATE TABLE IF NOT EXISTS docbakery (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "docprice_id" BIGINT NOT NULL,
    "bakery_id" BIGINT NOT NULL,
    FOREIGN KEY (docprice_id) REFERENCES docprice (id),
    FOREIGN KEY (bakery_id) REFERENCES bakery (id)
);
CREATE UNIQUE INDEX "IDX_docbakery_docprice_bakery" ON docbakery (docprice_id, bakery_id);
-- номер у контрагента уникальный
COMMENT ON TABLE docbakery IS 'Пекарни привязаные к документу.';
COMMENT ON COLUMN docbakery.docprice_id IS 'Документ ID';
COMMENT ON COLUMN docbakery.bakery_id IS 'Пекарня ID';
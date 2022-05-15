DROP TABLE IF EXISTS docpricelist CASCADE;
CREATE TABLE IF NOT EXISTS docpricelist (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "docprice_id" BIGINT NOT NULL,
    "products_id" BIGINT NOT NULL,
    "key_dog" BOOLEAN NOT NULL DEFAULT FALSE, -- договорная цена
    "article" CITEXT NOT NULL,
    "price_name" CITEXT,
    "cena" NUMERIC NOT NULL,
    "description" CITEXT DEFAULT '',
    "meta" jsonb NOT NULL default '{}'::jsonb,
    "user_id" BIGINT DEFAULT NULL,
    "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (docprice_id) REFERENCES docprice (id),
    FOREIGN KEY (products_id) REFERENCES products (id)
);
CREATE UNIQUE INDEX "IDX_docpricelist_docprice_article" ON docpricelist (docprice_id, article);
-- номер у контрагента уникальный
COMMENT ON TABLE docpricelist IS 'Прайс лист по документам.';
COMMENT ON COLUMN docpricelist.docprice_id IS 'Документ';
COMMENT ON COLUMN docpricelist.products_id IS 'Собственный продукт';
COMMENT ON COLUMN docpricelist.price_name IS 'Название продукта у магазина';
COMMENT ON COLUMN docpricelist.article IS 'Артикул магазина';
COMMENT ON COLUMN docpricelist.key_dog IS 'Ключ';
DROP TABLE IF EXISTS nomencl;
    CREATE TABLE IF NOT EXISTS nomencl (
      "id" BIGSERIAL PRIMARY KEY,  -- свой счетчик
      "name" CITEXT NOT NULL, /*Номенклатура*/
      "unit" BIGINT NOT NULL, /*Ед измерения*/
      "vidnomencl_id" BIGINT NOT NULL, /*Вид номенклатуры*/
      "productgroup" BIGINT NOT NULL, /*группа товаров*/
      "typeproduct" BIGINT NOT NULL, /*вид продукции*/
      "meta" jsonb default '{}'::jsonb
    );
    CREATE UNIQUE INDEX "IDX_nomencl_name" ON "nomencl" ("name");
    COMMENT ON TABLE nomencl IS 'Номенклатура.';
    COMMENT ON COLUMN nomencl.name IS 'Наименование';


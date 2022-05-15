DROP TABLE IF EXISTS nomenclature;
    DROP SEQUENCE IF EXISTS nomenclature_key_primary;
    CREATE SEQUENCE IF NOT EXISTS nomenclature_key_primary cache 1;
    CREATE TABLE IF NOT EXISTS nomenclature (
      id BIGINT NOT NULL PRIMARY KEY default nextval('nomenclature_key_primary'),  -- свой счетчик
      name BIGINT NOT NULL, /*Номенклатура*/ /*REFERENCES Customers (Id),*/
      unit TEXT NOT NULL default '', /*Ед измерения*/
      vidnomencl_id TEXT default '', /*Вид номенклатуры*/
      productgroups TEXT default '', /*группа товаров*/
      typeproduct TEXT default '', /*вид продукции*/
      meta jsonb default '{}'::jsonb
    );
    CREATE UNIQUE INDEX "IDX_nomenclature_nomenclature" ON "nomenclature" ("nomenclature");
      INSERT INTO nomenclature(nomenclature,unit,vidnomencl_id,productgroups,typeproduct)
    VALUES ('Яблоки','Кг.','Сырье','Фрукты','Холодные');
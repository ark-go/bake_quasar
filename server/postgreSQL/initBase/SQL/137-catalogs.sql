DROP TABLE IF EXISTS catalogs;
    CREATE TABLE IF NOT EXISTS catalogs (
      "id" BIGSERIAL PRIMARY KEY,
      "name" CITEXT NOT NULL, /*Номенклатура*/ /*REFERENCES Customers (Id),*/
      "catalog" CITEXT NOT NULL,
      "catalog_h" TEXT default '',
      "prim" TEXT DEFAULT '',
      "meta" jsonb default '{}'::jsonb
    );
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Единицы измерения','unit','unit_h','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Причины списания','cause','cause_h','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Операции','operation','operation_h','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Вид номенклатуры','vidnomencl','vidnomencl_h','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Вид продукта','vidprod','vidprod','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Вид сырья','vidraw','vidraw_h','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Группа сырья','groupraw','groopraw_h','с ...');
    INSERT INTO catalogs(name,catalog,catalog_h,prim)
    VALUES ('Блюдо','bludo','bludo_h','с ...');
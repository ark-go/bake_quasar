DROP TABLE IF EXISTS bakehouses;
    DROP SEQUENCE IF EXISTS bakehouses_key_primary;
    CREATE SEQUENCE IF NOT EXISTS bakehouses_key_primary cache 1;
    CREATE TABLE IF NOT EXISTS bakehouses (
      id BIGINT NOT NULL PRIMARY KEY default nextval('bakehouses_key_primary'),  -- свой счетчик
      bakehouse TEXT default '', /*Пекарня*/
      region TEXT default '', /*Регион*/
      territory TEXT default '', /*Территория*/
      own TEXT default '', /*Принадлежность*/
      city TEXT default '', /*Город*/
      brandname TEXT default '', /*Бренд*/
      distributing TEXT default '', /*Торговая сеть*/
      admin_id BIGINT, /*Управляющий*/
      meta jsonb default '{}'::jsonb
    );
    CREATE UNIQUE INDEX "IDX_bakehouses_region" ON "bakehouses" ("bakehouse");
      INSERT INTO bakehouses(bakehouse,region,city,admin_id)
    VALUES ('Пекарня №4','Лен. область','Санкт-Петербург',1);
  
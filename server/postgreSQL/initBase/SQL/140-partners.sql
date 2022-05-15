DROP TABLE IF EXISTS partners;
    DROP SEQUENCE IF EXISTS partners_key_primary;
    CREATE SEQUENCE IF NOT EXISTS partners_key_primary cache 1;
    CREATE TABLE IF NOT EXISTS partners (
      id BIGINT NOT NULL PRIMARY KEY default nextval('partners_key_primary'),  -- свой счетчик
      partner TEXT default '', /*Контрагент*/
      typepartner TEXT NOT NULL default '', /*тип Контрагента*/
      typeregistracion TEXT default '', /*Тип регистрации*/
      grouppartner TEXT default '', /*Группа контрагента*/
      meta jsonb default '{}'::jsonb
    );
    CREATE UNIQUE INDEX "IDX_partners_partner" ON "partners" ("partner");
      INSERT INTO partners(partner,typepartner,typeregistracion,grouppartner)
    VALUES ('Иванов','Клиент','Самозанятый','Торговая сеть');
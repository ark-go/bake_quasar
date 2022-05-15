-- table specdocvalue
-- Спецификация магазинов (2): значения
-- Рецепт или продукция не может повторятся в документе
-- При удалении документа связанные записи удаляются
DROP TABLE IF EXISTS specdocvalue;
    CREATE TABLE IF NOT EXISTS specdocvalue (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик id значения
      specdoc_id BIGINT NOT NULL,        /* Ссылка на родителя, документ */
      article_store CITEXT default '',   /* Артикул магазина */
      recept_id BIGINT NOT NULL,         /* Рецепт - продукт */
      cena NUMERIC(15,3) DEFAULT 0,      /* цена лепешки */
      prim CITEXT default '',            /* Примечание */
      user_id BIGINT NOT NULL,           /* наш пользователь*/
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, /* дата занесения - изменения*/
      meta jsonb default '{}'::jsonb,
      FOREIGN KEY (specdoc_id) REFERENCES specdoc ("id") ON DELETE CASCADE, /* При удалении родителя удаляем записи */
      FOREIGN KEY (user_id) REFERENCES users ("id") ON DELETE CASCADE,
      FOREIGN KEY (recept_id) REFERENCES recept ("id") ON DELETE CASCADE

    );
   /* Ресепт продукция на документ не повторяется */
   CREATE UNIQUE INDEX "IDX_specdocvalue_recept" ON "specdocvalue" (specdoc_id, recept_id);
 
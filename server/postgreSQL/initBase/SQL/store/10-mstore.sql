-- Магазины
DROP TABLE IF EXISTS mstore;
    CREATE TABLE IF NOT EXISTS mstore (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик id магазина
      mstore_name CITEXT NOT NULL,        -- Название
      mstore_shortname CITEXT default '',  -- Короткая название
      brand_id BIGSERIAL NOT NULL,      -- Бренд ИД
      citi_id  BIGSERIAL NOT NULL,      -- Город ИД
      mstore_address CITEXT DEFAULT "", -- Адрес дом литера
      counteragent_id BIGSERIAL NOT NULL, -- Контрагент

      date_start TIMESTAMPTZ NOT NULL, /* Дата начала дейсвия доп соглашения*/
      article_store CITEXT default '', /* Артикул магазина в доп согл */
      recept_id BIGINT NOT NULL,       /* id  рецепта */
      cena NUMERIC(15,3) DEFAULT 0,    /* цена лепешки */
      user_id BIGINT NOT NULL,   /* наш пользователь*/
      user_date TIMESTAMPTZ,     /* дата занесения - изменения*/
      meta jsonb default '{}'::jsonb,
      FOREIGN KEY (recept_id) REFERENCES recept (id) ON DELETE RESTRICT, -- Запрещаем удалять рецепт
      FOREIGN KEY (store_id) REFERENCES store (id) ON DELETE RESTRICT, -- Запрещаем удалять рецепт
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT -- Запрещаем удалять рецепт

    );
   CREATE UNIQUE INDEX "IDX_specstore_dopsogl" ON "specstore" ("doc_number");
   CREATE UNIQUE INDEX "IDX_specstore_date_article" ON "specstore" ("date_start","article_store");


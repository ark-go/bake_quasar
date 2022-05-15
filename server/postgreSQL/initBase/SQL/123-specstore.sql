-- Спецификация из магазина 
DROP TABLE IF EXISTS specstore;
    CREATE TABLE IF NOT EXISTS specstore (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик id магазина
      store_id BIGINT NOT NULL,        /* магазин ID */
      doc_number CITEXT default '',       /* номер документа Доп соглашение номер*/
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

--  foreign - нужен по двум полям но где
-- здесь я указываю что строка зависит от поля номенл и поля рецепт
DROP TABLE IF EXISTS store CASCADE;
    CREATE TABLE IF NOT EXISTS store (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- счетчик id магазина
      street CITEXT default 'no street',
      region CITEXT default '',    /*Регион*/
      territory CITEXT default '', /*Территория*/
      city CITEXT default '',      /*Город*/
      brandname CITEXT default '', /*Бренд*/
      distributing CITEXT default '', /*Торговая сеть*/
      legal CITEXT default '',      /*Юр лицо тороговой сети*/
      ourlegal CITEXT default '',   /*Наше юр лицо*/
      meta jsonb default '{}'::jsonb
    );
   CREATE UNIQUE INDEX "IDX_store_street" ON "store" ("street");
   -- INSERT INTO vidnomencl(name) SELECT * FROM unnest('{"Кг.","г.","л."}'::TEXT[]);
    INSERT INTO store(region,territory,city,distributing,brandname,street,legal,ourlegal)
    VALUES ('Центр','Волга','Санкт-Петербург','Перекресток','x5','xxxx 22-33-11','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Волга','Санкт-Петербург','Перекресток','x5','werqqwr','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Питер','Колпино','Перекресток','x5','qrqwer','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Юг','Краснодар','Магнит','x5','sdff','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Москва','Москва','Перекресток','x5','qwerq','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Юг','Ростов на дону','Перекресток','x5','gdfhdfg','Юр лицо магаз','ООО Новая звезда');
    ('Не центр','Планета замля','Мухосранск','Съешь лепеху','x700','ул. Грязная лужа','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Юг','Краснодар','Магнит','x5','sdff','Юр лицо магаз','ООО Новая звезда'),
    ('Центр','Москва','Москва','Мухосранск','x5','qwerq','Юр лицо магаз','ООО Новая звезда'),
    ('Не центр','Планета замля','Мухосранск','Восьмерочка','x70','ул. Навозная куча','Юр лицо магаз','ООО Новая звезда');

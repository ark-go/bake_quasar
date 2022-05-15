su postgres  // после установки есть такой
psql // входим в сервер SQL
// создайте пользователя и базу 
postgres=# CREATE USER apiuser;  //  CREATE USER apiuser PASSWORD 'xx'  // с паролем
postgres=# ALTER USER apiuser WITH PASSWORD 'asi$$!23dkrnfgt'; // если изменить пароль
postgres=# CREATE DATABASE kanbase OWNER apiuser ENCODING 'UTF-8' TEMPLATE template0; // создаем с владельцем

// Создать вручную стартовую таблицу сессий  она будет для пользователя postgress, после переназначить
postgres=# \c kanbase   // перейти в базу !!!
kanbase=#
CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);
kanbase=#
  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
kanbase=#
  CREATE INDEX "IDX_session_expire" ON "session" ("expire");

  // вернуть владельца на таблицу
kanbase=#
  ALTER TABLE session OWNER TO apiuser;
// -----------------------
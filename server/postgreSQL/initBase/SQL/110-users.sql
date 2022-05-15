DROP TABLE IF EXISTS users;
    DROP SEQUENCE IF EXISTS users_key_primary;
    CREATE SEQUENCE IF NOT EXISTS users_key_primary cache 1;
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT NOT NULL PRIMARY KEY default nextval('users_key_primary'),  -- свой счетчик
      email TEXT NOT NULL default '',
      password TEXT default '',
      active boolean,
      username TEXT default '',
      u_fam TEXT default '',
      u_name TEXT default '',
      u_otch TEXT default '',
      "uuidMailChange" TEXT default '',
      "uuidMailChangeDate" TIMESTAMP DEFAULT NULL,
      "blockedDate" TIMESTAMP DEFAULT NULL,
      "blockedMessage" TEXT default '',
      roles TEXT ARRAY,
      permissions jsonb default '{}'::jsonb,
      meta jsonb default '{}'::jsonb,
      "fa2code" TEXT default '',
      "telegramId" TEXT default '',
      "createAt" TIMESTAMP DEFAULT NOW()
    );
    CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email");
    INSERT INTO users(email,password,active,roles,permissions)
    VALUES ('admin@admin.tsg','{"salt":"300abec03a7dedb5","passwordHash":"3f28960c51d9f6d98cf6791955d8b6ee5474e2e93b770d5f84b8bdbc34637abd061d323454fb4a99a79b3d212e6de783f03f4f72d466d44b7b1f82f107f06464"}',true,'{"USER","ADMIN"}'::text[],'{}'::jsonb);
    INSERT INTO users(email,password,active,roles,permissions)
    VALUES ('user@user.tsg','12345567890',true,'{"USER"}'::text[],'{}'::jsonb);
    INSERT INTO users(email,password,active,roles,permissions)
    VALUES ('moderator@moderator.tsg','12345567890',true,'{"MODERATOR"}'::text[],'{}'::jsonb);
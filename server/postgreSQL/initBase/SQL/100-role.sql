DROP TABLE IF EXISTS roles;
    -- DROP SEQUENCE IF EXISTS roles_key_primary;
    -- CREATE SEQUENCE IF NOT EXISTS roles_key_primary cache 1;
    CREATE TABLE IF NOT EXISTS roles (
    --  id BIGINT NOT NULL PRIMARY KEY default nextval('roles_key_primary'),  -- свой счетчик
      "roleName" TEXT NOT NULL default '',
      "description" TEXT default '',
      permissions jsonb  default '{}'::jsonb
          );
    CREATE UNIQUE INDEX "IDX_roles_rolename" ON "roles" ("roleName");
     INSERT INTO roles("roleName", permissions, "description") VALUES ('template','{}'::jsonb, 'все права тут');
     INSERT INTO roles("roleName", permissions, "description") VALUES ('ADMIN','{}'::jsonb, 'Администратор всего');
     INSERT INTO roles("roleName", permissions, "description") VALUES ('USER','{}'::jsonb, 'Простые пользователи');
     INSERT INTO roles("roleName", permissions, "description") VALUES ('MODERATOR','{}'::jsonb, 'Модераторы');
-- Разрешения
DROP TABLE IF EXISTS users_permiss_all;
CREATE TABLE IF NOT EXISTS users_permiss_all (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name CITEXT UNIQUE NOT NULL CHECK(char_length(trim(name)) >= 4),
    code_name CITEXT UNIQUE NOT NULL CHECK(code_name ~ '^[a-z][A-Za-z1-9}]{3,19}$'), -- 4-20 лат букв и подчерк
    danger_level BIGINT default '0',
    description CITEXT NOT NULL CHECK(char_length(trim(description)) >= 10),
    meta jsonb default '{}'
);
-- CREATE UNIQUE INDEX "idx_users_permiss_all" ON "users_permiss_all" (name, denied);

 COMMENT ON TABLE users_permiss_all IS 'Все возможные коды доступа, разрешения';
 COMMENT ON COLUMN users_permiss_all.code_name IS 'Код доступа';
 COMMENT ON COLUMN users_permiss_all.denied IS 'Флаг запрещающего кода';
 COMMENT ON COLUMN users_permiss_all.danger_level IS 'Уровень опасности разрешения';
insert into users_permiss_all(name, code_name, description, meta)
values('Разработчик','creator','Разработчик программы','{ "noDelete" :true,"hidden":true }');
insert into users_permiss_all(name, code_name, description, meta)
values('Администратор','admin','Самый главный по ролям','{ "noDelete" :true }');
-- админ роли  установка ролей ниже своей и только те которые есть у самого
--? снятие роли
-- чтение у роли
-- чтение ниже
-- запись у роли
-- запись всего ниже
--- Триггер не даст удалить и изменить code_name
CREATE OR REPLACE FUNCTION users_permiss_all_protect() RETURNS TRIGGER --
    AS $BODY$ --
    BEGIN 
     IF (TG_OP = 'DELETE') THEN 
       IF old.meta->'noDelete' = 'true' THEN 
         raise exception 'Не надо удалять эту строку!.';
       END IF;
       RETURN OLD;
     END IF;
   IF (TG_OP = 'UPDATE') THEN 
    IF old.meta->'noDelete' = 'true' THEN 
      new.meta = jsonb_set(new.meta, '{noDelete}', 'true'::jsonb);
    END IF;
    IF old.code_name = 'admin' OR old.code_name = 'creator' THEN
	  new.code_name = old.code_name;
    END IF;
  END IF;
RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;
--
DROP TRIGGER IF EXISTS tg_users_permiss_all_protect on users_permiss_all;
CREATE TRIGGER tg_users_permiss_all_protect BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON users_permiss_all FOR EACH ROW EXECUTE PROCEDURE users_permiss_all_protect();
---  Конец Триггера
--! прошел
222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
---
-- Дерево групп и вложенности, необходим триггер запрещающий вкладывать повторно в одну ветку.

CREATE TABLE IF NOT EXISTS users_role_tree (
    --id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    parent_id BIGINT CHECK(parent_id <> id) REFERENCES users_role_tree (id) ON DELETE CASCADE, -- дерево собственное
    role_name CITEXT UNIQUE NOT NULL CHECK(char_length(trim(role_name)) >= 4), -- Имя роли
    role_code CITEXT UNIQUE NOT NULL CHECK(char_length(trim(role_code)) >= 4), -- Код роли
    drop
    description CITEXT NOT NULL CHECK(char_length(trim(description)) >= 10), -- описание
    meta jsonb default '{}'
)
COMMENT ON TABLE users_role_tree IS 'Дерево ролей';
--! прошел

3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333

-- разрешения на роль не повторяются
CREATE UNIQUE INDEX "idx_users_group_permiss_id" ON "users_group_permiss" (id, permiss_id);
-- имена у роли не повторяются
CREATE UNIQUE INDEX "idx_users_group_permiss_name" ON "users_group_permiss" (permiss_id, group_name);
-- коды у роли не повторяются
CREATE UNIQUE INDEX "idx_users_group_permiss_code" ON "users_group_permiss" (permiss_id, group_code);
--
insert into users_group_tree(name, parent_id, sorted, meta)
values('Разработчик', null, 0, '{ "noDelete" :true }');
-- роль имя роли Пекари
-- роль справочник - разрешение чтение. запись.редактир
-- роль справочник - чтение только свои по контрагенту
-- роль справочник - чтение только свои печки                   



-- Группы роль с разрешениями, название роли и ее разрешения
CREATE TABLE IF NOT EXISTS users_group_permiss (
    id BIGINT NOT NULL REFERENCES users_group_tree (id) ON DELETE CASCADE, -- на дерево
    permiss_id BIGINT NOT NULL REFERENCES users_permiss_all (id) ON DELETE CASCADE  -- разрешения
);

---
-- Назначения групп пользователям
DROP TABLE IF EXISTS users_permiss;
CREATE TABLE IF NOT EXISTS users_permiss (
    id BIGINT PRIMARY KEY NOT NULL REFERENCES users_login (id) ON DELETE CASCADE,
    roles_id BIGINT NOT NULL REFERENCES users_group_permiss (id),
    permiss jsonb default '{}',
    -- время редактированния
    "user_id" BIGINT,
    "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    meta jsonb default '{}'::jsonb
);
-- ролям не повторятся на пользователя
CREATE UNIQUE INDEX "idx_users_permiss" ON "users_permiss" (id, roles_id);
--
-- Назначения групп part-ам т.е. дереву
DROP TABLE IF EXISTS users_part_droup_permiss;
CREATE TABLE IF NOT EXISTS users_part_group_permiss (
    id BIGINT PRIMARY KEY NOT NULL REFERENCES users_part (id) ON DELETE CASCADE,
    -- код юзеру для регистраци
    roles_id [],
    permiss jsonb default '{}',
    -- время редактированния
    "user_id" BIGINT,
    "user_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    meta jsonb default '{}'::jsonb
);
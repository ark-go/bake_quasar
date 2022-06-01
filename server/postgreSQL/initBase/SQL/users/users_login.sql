lkjljl DROP TABLE IF EXISTS users_part CASCADE;
www DROP SEQUENCE IF EXISTS users_part_sorted;
--CREATE SEQUENCE IF NOT EXISTS users_part_sorted cache 1 INCREMENT BY 100;
create table users_part (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- может быть нулем т.е. корнем
    parent_id BIGINT CHECK(parent_id <> id),
    sorted BIGINT NOT NULL DEFAULT 500,
    permiss jsonb DEFAULT '{}'::jsonb,
    meta jsonb DEFAULT '{}'::jsonb,
    name CITEXT NOT NULL CHECK(char_length(trim(name)) > 2),
    description CITEXT DEFAULT '',
    FOREIGN KEY (parent_id) REFERENCES users_part (id)
);
CREATE INDEX IF NOT EXISTS idx_users_part_parent_id ON users_part (parent_id);
CREATE INDEX IF NOT EXISTS idx_users_part_sorted ON users_part (sorted);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_part_name ON users_part (parent_id, name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_part_name_null ON users_part (name)
WHERE parent_id IS NULL;
insert into users_part(name, parent_id, sorted, meta)
values(
        'Не назначенные',
        null,
        99999,
        '{ "noDelete" :true,"freeUser" :true }'
    );
insert into users_part(name, parent_id, sorted, meta)
values('Администрация', null, 0, '{ "noDelete" :true }');
insert into users_part(name, parent_id, sorted, meta)
values(
        'Разработчики',
        null,
        100000,
        '{ "noDelete" :true,"hidden": true }'
    );
--
DROP TABLE IF EXISTS users_login CASCADE;
CREATE TABLE IF NOT EXISTS users_login (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    part_id BIGINT NOT NULL REFERENCES users_part (id) ON DELETE CASCADE,
    email CITEXT UNIQUE NOT NULL,
    password CITEXT,
    username CITEXT UNIQUE,
    fa2code CITEXT,
    telegram CITEXT,
    active BOOL NOT NULL DEFAULT FALSE,
    activated_user_id BIGINT,
    blocked_mess CITEXT,
    blocked_user_id BIGINT,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    meta jsonb default '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_users_login_part_id ON users_login (part_id);
CREATE INDEX IF NOT EXISTS idx_users_login_email ON users_login (email);
--
DROP TABLE IF EXISTS users_register;
CREATE TABLE IF NOT EXISTS users_register (
    id BIGINT PRIMARY KEY NOT NULL REFERENCES users_login (id) ON DELETE CASCADE,
    -- код юзеру для регистраци
    check_mailcode CITEXT,
    -- время создания кода
    check_maildate TIMESTAMPTZ,
    meta jsonb default '{}'::jsonb
);
--
DROP TABLE IF EXISTS users_avatar;
CREATE TABLE IF NOT EXISTS users_avatar (
    id BIGINT PRIMARY KEY NOT NULL REFERENCES users_login (id) ON DELETE CASCADE,
    avatar BYTEA,
    meta jsonb default '{}'::jsonb
);
--
CREATE OR REPLACE FUNCTION users_part_protect() RETURNS TRIGGER --
    AS $BODY$ --
    BEGIN IF (TG_OP = 'DELETE') THEN IF old.meta->'noDelete' = 'true' THEN raise exception 'Не надо удалять эту строку!.';
END IF;
RETURN OLD;
END IF;
IF (TG_OP = 'UPDATE') THEN IF old.meta->'noDelete' = 'true' THEN new.meta = jsonb_set(new.meta, '{noDelete}', 'true'::jsonb);
END IF;
END IF;
RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;
--
DROP TRIGGER IF EXISTS tg_users_part_protect on users_part;
CREATE TRIGGER tg_users_part_protect BEFORE
INSERT
    OR
UPDATE
    OR DELETE ON users_part FOR EACH ROW EXECUTE PROCEDURE users_part_protect();
/*
 === в отдельном файле.. замена работает.
 update users_part 
 set 
 name = 'fff4',
 --meta = jsonb_set(meta,'{noDelete}','false')  -- в корнь
 --meta = jsonb_set(meta,'{raz}','false'::jsonb,true) -- добавит по одному, путь ?
 meta = jsonb_set(meta,'{dva}','{"noDelete":false,"qqq":{"eee":123,"ddd":555},"xxx":true}'::jsonb) -- добавим json
 --meta = jsonb_set(meta,'{dva,qqq,ddd}','"6666"'::jsonb) -- заменим по пути , здесь 555 на 6666
 --meta = meta || '{"isFree":false}'::jsonb --
 where id = 1;
 select * from users_part;
 ===
 CREATE OR REPLACE FUNCTION users_part_protect() RETURNS TRIGGER --
 AS $BODY$ --
 BEGIN 
 IF (TG_OP = 'DELETE') THEN
 IF old.meta -> 'noDelete' = 'true' THEN
 raise exception 'Не надо удалять эту строку!.';
 END IF;
 RETURN OLD;
 END IF;
 IF (TG_OP = 'UPDATE') THEN
 IF old.meta -> 'noDelete' = 'true' THEN
 new.meta = jsonb_set(new.meta,'{noDelete}','true'::jsonb);
 END IF;
 END IF;
 RETURN NEW;
 END;
 $BODY$ LANGUAGE plpgsql;
 --
 DROP TRIGGER IF EXISTS tg_users_part_protect on users_part;
 CREATE TRIGGER tg_users_part_protect 
 BEFORE INSERT OR UPDATE OR DELETE ON users_part FOR EACH ROW
 EXECUTE PROCEDURE users_part_protect();
 */
ALTER TABLE users_login
ADD COLUMN status CITEXT;
ALTER TABLE users_login
ADD COLUMN status_mess CITEXT;
ALTER TABLE users_login
ADD COLUMN status_date TIMESTAMPTZ;
ALTER TABLE users_login DROP COLUMN status;
ALTER TABLE users_login DROP COLUMN status_mess;
ALTER TABLE users_login DROP COLUMN status_date
ALTER TABLE users_login DROP COLUMN active;
ALTER TABLE users_login DROP COLUMN blocked_mess;
ALTER TABLE users_login DROP COLUMN blocked_user_id;
ALTER TABLE users_login DROP COLUMN activated_user_id;
ALTER TABLE users_login
ADD COLUMN status_user_id BIGINT NOT NULL CHECK(status_user_id <> id);
ALTER TABLE users_login
ADD CONSTRAINT fg_users_login_status FOREIGN KEY (status_user_id) REFERENCES users_login (id);
-- текущий пользователь
select 'Database : ' || current_database() || ', ' || 'User : ' || user db_details -- or
select format(
        'Database: %s, User: %s',
        current_database(),
        user
    ) db_details
select user
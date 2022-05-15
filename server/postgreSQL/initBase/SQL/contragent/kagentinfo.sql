-- Группа контр агента
DROP TABLE  IF EXISTS kagentgroup CASCADE;
    CREATE TABLE IF NOT EXISTS kagentgroup (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- ID Key
      name CITEXT NOT NULL,          -- Наименование
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_kagentgroup_name" ON kagentgroup ("name");
COMMENT ON TABLE kagentgroup IS 'Группа контрагента.';
-- Вид контрагента
DROP TABLE IF EXISTS kagentvid CASCADE;
    CREATE TABLE IF NOT EXISTS kagentvid (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- ID Key
      name CITEXT NOT NULL,          -- Наименование
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_kagentvid_name" ON kagentvid ("name");
COMMENT ON TABLE kagentvid IS 'Вид контрагента.';
-- Вид регистрации контрагента
DROP TABLE IF EXISTS kagentvidreg CASCADE;
    CREATE TABLE IF NOT EXISTS kagentvidreg (
      id BIGSERIAL PRIMARY KEY NOT NULL,    -- ID Key
      name CITEXT NOT NULL,          -- Наименование
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_kagentvidreg_name" ON kagentvidreg ("name");
COMMENT ON TABLE kagentvidreg IS 'Вид регистрации контрагента.';

-- Список видов контрагента
DROP TABLE IF EXISTS kagentvids CASCADE;
    CREATE TABLE IF NOT EXISTS kagentvids (
      id BIGSERIAL PRIMARY KEY NOT NULL,    -- ID Key
      kagent_id BIGINT NOT NULL,
      kagentvid_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb,
      FOREIGN KEY ("kagentvid_id") REFERENCES kagentvid ("id") ON DELETE RESTRICT
    );
CREATE UNIQUE INDEX "IDX_kagentvids_id_vid" ON kagentvids (kagent_id,kagentvid_id);
COMMENT ON TABLE kagentvids IS 'Список видов контрагента у контрагента.';

-- Список групп контрагента
DROP TABLE IF EXISTS kagentgroups CASCADE;
    CREATE TABLE IF NOT EXISTS kagentgroups (
      id BIGSERIAL PRIMARY KEY NOT NULL,    -- ID Key
      kagent_id BIGINT NOT NULL,
      kagentgroup_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb,
      FOREIGN KEY ("kagentgroup_id") REFERENCES kagentgroup ("id") ON DELETE RESTRICT
    );
CREATE UNIQUE INDEX "IDX_kagentgroups_id_vid" ON kagentgroups (kagent_id,kagentgroup_id);
COMMENT ON TABLE kagentgroups IS 'Список групп контрагента у контрагента.';

-- 
-- Контр агент  
-- Поля данных для контрагента
DROP TABLE IF EXISTS kagent CASCADE;
    CREATE TABLE IF NOT EXISTS kagent (
      id BIGSERIAL PRIMARY KEY NOT NULL,  -- ID Key  ключ  для всех!
      name CITEXT NOT NULL,
--      kagent_id BIGINT NOT NULL,      -- это будет ключом для всех кто захочет эти данные прикрепить к себе
     -- vid_id BIGINT NOT NULL,          -- Вид контрагента
     -- group_id BIGINT NOT NULL,        -- Группа контр агента
      vidreg_id BIGINT NOT NULL ,      -- Вид регистрации
     -- trademark_id BIGINT NOT NULL,     -- Торговая сеть
      inn CITEXT DEFAULT NULL, -- NOT NULL,              -- удаляем NOT NULL
      franchising BOOL NOT NULL DEFAULT FALSE,  -- франчайзинг
      owncompany BOOL NOT NULL DEFAULT FALSE,   -- наши компании
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb,
      --FOREIGN KEY ("id") REFERENCES kagentvids ("kagent_id") ON DELETE RESTRICT,
      FOREIGN KEY ("vidreg_id") REFERENCES kagentvidreg ("id") ON DELETE RESTRICT,
      FOREIGN KEY ("trademark_id") REFERENCES trademark ("id") ON DELETE RESTRICT
     -- FOREIGN KEY ("id") REFERENCES kagentgroups ("kagent_id") ON DELETE RESTRICT
    );
CREATE UNIQUE INDEX "IDX_kagent_name" ON kagent ("name");
CREATE UNIQUE INDEX "IDX_kagent_inn" ON kagent ("inn");
--CREATE INDEX "IDX_kagent_trademark" ON kagent ("trademark_id"); -- их может быть много

--CREATE INDEX "IDX_kagent_vid" ON kagent ("vidreg_id");
--CREATE INDEX "IDX_kagent_group" ON kagent ("group_id");
CREATE INDEX "IDX_kagent_vidreg" ON kagent ("vidreg_id");


COMMENT ON TABLE kagent IS 'Контрагенты.';
COMMENT ON COLUMN kagent.name IS 'Наименование контрагента';
--COMMENT ON COLUMN kagent.kagent_id IS 'Ключ привязки информации к контрагенту';
COMMENT ON COLUMN kagent.vidreg_id IS 'ID Списка видов контрагента';
--COMMENT ON COLUMN kagent.group_id IS 'ID Списка групп контр агента';
COMMENT ON COLUMN kagent.inn IS 'ID Вид регистрации';
COMMENT ON COLUMN kagent.franchising IS 'признак франчайзинг';
COMMENT ON COLUMN kagent.owncompany IS 'признак свои сети, свои контрагенты';

--ALTER TABLE kagentvids
--DROP CONSTRAINT IF EXISTS kagentvids_kagent;

ALTER TABLE kagentvids 
ADD CONSTRAINT kagentvids_kagent 
FOREIGN KEY (kagent_id) 
REFERENCES kagent (id)
ON DELETE CASCADE;

ALTER TABLE kagentgroups
DROP CONSTRAINT IF EXISTS kagentgroups;

ALTER TABLE kagentgroups 
ADD CONSTRAINT kagentgroups_kagent 
FOREIGN KEY (kagent_id) 
REFERENCES kagent (id)
ON DELETE CASCADE;

--! ----------------------------------
/*
ALTER TABLE kagent  -- удаляем ограничение NOT NULL
 ALTER COLUMN inn DROP NOT NULL,
 ALTER COLUMN inn SET DEFAULT NULL;
*/
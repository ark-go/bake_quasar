--  таблица Торговых сетей у контрагента
-- здесь список торговых сетей закрепленных за контрагентом
-- они используются в списках для выбора в 
-- 1) bakery пекарни 

DROP TABLE IF EXISTS kagent_tm CASCADE;
    CREATE TABLE IF NOT EXISTS kagent_tm (
      id BIGSERIAL PRIMARY KEY NOT NULL,    -- ID Key
      trademark_id BIGINT NOT NULL REFERENCES trademark ON DELETE CASCADE ,       -- id Торговая сеть
      kagent_id BIGINT NOT NULL REFERENCES kagent ON DELETE CASCADE,          -- id Контрагент
      user_id BIGINT NOT NULL DEFAULT 0,
      user_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      meta jsonb default '{}'::jsonb
    );
CREATE UNIQUE INDEX "IDX_kagent_tm_tk" ON kagent_tm (trademark_id,kagent_id);
COMMENT ON TABLE kagent_tm IS 'Контрагенты х торговые сети.';

/*
сюда ключ из bakery 
tm_kagent_id  т.е. ссылку на kagent_id
own_kagent_id
fr_kagent_id
*/
DROP TABLE IF EXISTS historybakeadmin;
    DROP SEQUENCE IF EXISTS historybakeadmin_key_primary;
    CREATE SEQUENCE IF NOT EXISTS historybakeadmin_key_primary cache 1;
    CREATE TABLE IF NOT EXISTS historybakeadmin (
      id BIGINT NOT NULL PRIMARY KEY default nextval('historybakeadmin_key_primary'),  -- свой счетчик
      id_bake BIGINT NOT NULL, /* это пекарня */
      id_user BIGINT NOT NULL, /* имя админа*/
      adm_date TIMESTAMPTZ default CURRENT_TIMESTAMP, /*дата назначения для пояса*/
      meta jsonb default '{}'::jsonb,
      FOREIGN KEY (id_user) REFERENCES users (Id) /* ON DELETE CASCADE */
    );
    
    CREATE INDEX "IDX_historybakeadmin" ON "historybakeadmin" (id_bake, id_user, adm_date);

    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (1,1,'15.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (1,2,'18.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (1,2,'22.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (1,3,'13.02.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (2,3,'18.03.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (2,3,'23.04.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (2,3,'19.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (3,2,'31.03.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (3,2,'20.03.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (3,2,'16.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (4,2,'15.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (4,3,'12.01.2022');
    INSERT INTO historybakeadmin(id_bake,id_user,adm_date) VALUES (4,2,'30.01.2022');





/*
SELECT *
FROM `jos_content`
WHERE publish_up=(SELECT MAX(publish_up) FROM jos_content)
*/
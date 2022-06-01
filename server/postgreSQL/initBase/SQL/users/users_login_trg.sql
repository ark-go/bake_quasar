CREATE OR REPLACE FUNCTION users_part_protect() RETURNS TRIGGER --
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
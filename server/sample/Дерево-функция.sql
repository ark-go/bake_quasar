CREATE TABLE test (
  node_id int,
  parent_node int,
  name text,
  ttt text default 'xx'
);

INSERT INTO test VALUES 
(1, NULL, 'node1'),
(2, 1, 'node2'),
(3, 1, 'node3'),
(3, 200, 'node3_3'),
(200, 1, 'node200'),
(201, 200, 'node201'),
(205, 1, 'node205'),
(202, 200, 'node202'),
(4, 2, 'node4'),
(5, 2, 'node5'),
(6, 2, 'node6'),
(7, 3, 'node7'),
(8, 3, 'node8');

--------
CREATE OR REPLACE FUNCTION json_tree() RETURNS jsonb AS $$
DECLARE
    _json_output jsonb;
    _temprow record;
BEGIN
    SELECT 
        jsonb_build_object('name', name, 'children', array_to_json(ARRAY[]::int[])) 
    INTO _json_output 
    FROM test 
    WHERE parent_node IS NULL;
    
    FOR _temprow IN
        WITH RECURSIVE tree(node_id, ancestor, child, path, json) AS  (
          SELECT 
              t1.node_id, 
              NULL::int, 
              t2.node_id,
              '{children}'::text[] || (row_number() OVER (PARTITION BY t1.node_id ORDER BY t2.node_id) - 1)::text,
              jsonb_build_object('name', t2.name, 'children', array_to_json(ARRAY[]::int[]))
          FROM test t1
          LEFT JOIN test t2 ON t1.node_id = t2.parent_node
          WHERE t1.parent_node IS NULL

          UNION

          SELECT
              t1.node_id, 
              t1.parent_node, 
              t2.node_id,
              tree.path || '{children}' || (row_number() OVER (PARTITION BY t1.node_id ORDER BY t2.node_id) - 1)::text, 
              jsonb_build_object('name', t2.name, 'children', array_to_json(ARRAY[]::int[]))
          FROM test t1
          LEFT JOIN test t2 ON t1.node_id = t2.parent_node
          INNER JOIN tree ON (t1.node_id = tree.child)
          WHERE t1.parent_node = tree.node_id
        )
        SELECT 
            child as node_id, path, json 
        FROM tree 
        WHERE child IS NOT NULL ORDER BY path
    LOOP
        SELECT jsonb_insert(_json_output, _temprow.path, _temprow.json) INTO _json_output;
    END LOOP;
    
    RETURN _json_output;
END;
$$ LANGUAGE plpgsql;

----- вызов
SELECT jsonb_pretty(json_tree());
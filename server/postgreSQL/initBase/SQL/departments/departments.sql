DROP TABLE IF EXISTS departments CASCADE;
create table departments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    parent_id BIGINT CHECK(parent_id <> id),
    sorted BIGINT DEFAULT 0,
    name CITEXT NOT NULL CHECK(char_length(trim(name)) > 2),
    description CITEXT DEFAULT '',
    FOREIGN KEY (parent_id) REFERENCES departments (id)
);
insert into departments(name, parent_id)
values('Главный', null);
insert into departments(name, parent_id)
values('Первый', null);
insert into departments(name, parent_id)
values('Второй', null);
insert into departments(name, parent_id)
values('Третий', null);
insert into departments(name, parent_id)
values('Четвертый', null);
/*
 with recursive dep as
 (select id, name, parent_id from departments
 where parent_id = 6   -- is null (без равно)  ... или = число   null  это верхний уровнь
 union all
 select
 c.id, c.name, c.parent_id
 from dep p, departments c
 where c.parent_id = p.id)
 select * from dep;
 */
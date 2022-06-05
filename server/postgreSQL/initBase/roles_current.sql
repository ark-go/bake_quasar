drop table users_roles CASCADE;
CREATE TABLE IF NOT EXISTS users_roles (
    id BIGINT PRIMARY KEY GENERATED always AS IDENTITY,
	name CITEXT UNIQUE NOT NULL constraint users_roles_name_length CHECK(char_length(trim(name)) >= 4), -- Имя роли
    role_code CITEXT UNIQUE NOT NULL constraint users_roles_role_code_length CHECK(role_code ~ '^[a-z][A-Za-z1-9}]{3,19}$'), -- Код роли
    description CITEXT NOT NULL constraint users_roles_description_length CHECK(char_length(trim(description)) >= 10), -- описание
    meta jsonb default '{}'
);
COMMENT ON TABLE users_role_tree IS 'Дерево ролей';



drop table users_roles_tree;
CREATE TABLE IF NOT EXISTS users_roles_tree (
    --id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id BIGINT PRIMARY KEY GENERATED always AS IDENTITY,
    parent_id BIGINT CHECK(parent_id <> id) REFERENCES users_roles_tree (id) ON DELETE CASCADE, -- дерево собственное
    role_id BIGINT NOT NULL constraint users_roles_tree_role_id  REFERENCES users_roles (id),
	user_id BIGINT NOT NULL constraint users_roles_tree_user_id REFERENCES users_login (id),
	meta jsonb default '{}'
	--role_name CITEXT UNIQUE NOT NULL CHECK(char_length(trim(role_name)) >= 4), -- Имя роли
    --role_code CITEXT UNIQUE NOT NULL CHECK(char_length(trim(role_code)) >= 4), -- Код роли
    --description CITEXT NOT NULL CHECK(char_length(trim(description)) >= 10), -- описание
    --meta jsonb default '{}'
);
CREATE INDEX idx_users_roles_tree_parent_id ON users_roles_tree(parent_id);
CREATE INDEX idx_users_roles_tree_role_id ON users_roles_tree(role_id);
CREATE INDEX idx_users_roles_tree_user_id ON users_roles_tree(user_id);

COMMENT ON TABLE users_roles_tree IS 'Дерево ролей';

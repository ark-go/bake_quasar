DROP TABLE IF EXISTS productassortment CASCADE;
CREATE TABLE IF NOT EXISTS productassortment (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    producttype_id BIGINT NOT NULL,
    name CITEXT NOT NULL CONSTRAINT assortment_name_length CHECK(char_length(trim(name)) > 2),
    prefix CITEXT UNIQUE NOT NULL CONSTRAINT assortment_prefix_length CHECK(char_length(trim(prefix)) > 1),
    -- префикс для артикула, будет влиять на все продукты
    -- если захотят интеграцию
    -- article CITEXT UNIQUE DEFAULT nextval('products_raw_sequence')::CITEXT NOT NULL,
    -- собственный артикул
    FOREIGN KEY (producttype_id) REFERENCES producttype ("id")
);
COMMENT ON TABLE productassortment IS 'Ассортимент.';
CREATE UNIQUE INDEX "IDX_assortment_producttype" ON productassortment (producttype_id, name);
ALTER TABLE products
ADD COLUMN massbrutto NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE products
ADD COLUMN massnetto NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE products
ADD COLUMN massfinish NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE productingred
ADD COLUMN sumbrutto NUMERIC;

ALTER TABLE productingred
ADD COLUMN sumnetto NUMERIC;

ALTER TABLE productingred
ADD COLUMN sumfinish NUMERIC;

UPDATE productingred
SET proportion_b = dol.proport,
	sumbrutto = dol.brutto,
	sumnetto = dol.netto,
	sumfinish = dol.finish
FROM (
		SELECT is_raw,
			id,
			products_id,
			products_id_child,
			massbrutto,
			massnetto,
			SUM(massnetto) OVER w AS netto,
			SUM(massbrutto) OVER w AS brutto,
			SUM(massfinish) OVER w AS finish,
			ROUND(
				massbrutto / (SUM(massbrutto) OVER (PARTITION BY products_id)) * 100,
				2
			) AS proport
		FROM productingred
		WHERE products_id = 98 WINDOW w AS (PARTITION BY products_id)
	) AS dol
WHERE productingred.id = dol.id
UPDATE productingred
SET massnetto = child.sumnetto,
	massbrutto = child.sumbrutto,
	massfinish = child.sumfinish,
	FROM (
		SELECT DISTINCT ON (products_id) *
		FROM productingred
		WHERE products_id = 98
	) AS child
WHERE productingred.products_id_child = child.products_id
	AND tr IS FALSE ------------------------------------------
ALTER TABLE category
ADD CONSTRAINT cat_cat_id_fkey FOREIGN KEY (parent_id) REFERENCES category (cat_id) MATCH SIMPLE ON
UPDATE CASCADE ON
DELETE CASCADE
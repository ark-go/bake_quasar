// вернет из таблицы bakery_territory, назначения пекарен группам, все пекарни
на заданное число, или одну пекарню если задан ее ID
get_bakery_territory_last('2022-07-06',28);



SELECT * from bakery_territory_add(39,3,false,'2022-07-06')
bakery_id - эта хрень должна быть единственной в базе уникальной с is_last
territory_id
transfer false - будем переносить если есть активная
date_start - дата открытия
user_id - пользователь

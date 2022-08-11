export const columns = [
  {
    name: "article",
    label: "Артикул",
    align: "left",
    field: "article",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "price_name",
    label: "Товар",
    align: "left",
    field: "price_name",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "productvid_name",
    label: "Продукт",
    align: "left",
    field: "productvid_name",
    sortable: true,
  },
  {
    name: "cena",
    label: "Цена",
    align: "left",
    field: "cena",
    sortable: true,
  },
  {
    name: "franch_cena",
    label: "Цена фр.",
    align: "left",
    field: "franch_cena",
    sortable: true,
  },
  // {
  //   name: "franch_list",
  //   label: "Франчайзи",
  //   align: "left",
  //   field: "franch_list",
  //   sortable: true,
  // },
  {
    name: "description",
    label: "Комментарий",
    align: "left",
    field: "description",
    hidden: true,
    sortable: true,
  },
];

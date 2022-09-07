export const columns = [
  {
    name: "article_buff",
    label: "Артикул буфф",
    align: "left",
    field: "article_buff",
    required: true, // нельзя выключить
    sortable: true,
    classes: (row) => {
      if (!row.article) return "bg-red-2";
      if (row.article_original == row.article_buff) return "bg-green-2";
    },
    headerClasses: "bg-orange-2",
  },
  {
    name: "count_buff",
    label: "Кол-во",
    align: "left",
    field: "count_buff",
    required: true, // нельзя выключить
    sortable: true,
    classes: (row) => {
      if (!row.article) return "bg-red-2";
      if (row.article_original == row.article_buff) return "bg-green-2";
    },
    headerClasses: "bg-orange-2",
  },
  {
    name: "datesale_str_buff",
    label: "Продажа",
    align: "left",
    field: "datesale_str_buff",
    required: true, // нельзя выключить
    sortable: true,
    classes: (row) => {
      if (!row.article) return "bg-red-2";
      if (row.article_original == row.article_buff) return "bg-green-2";
    },
    headerClasses: "bg-orange-2",
  },
  {
    name: "count_sale_old",
    label: "в базе",
    align: "right",
    field: "count_sale_old",
    required: true, // нельзя выключить
    sortable: true,
    classes: (row) => {
      if (!row.count_sale_old) return;
      if (row.count_sale_old != row.count_buff) return "bg-red-2";
      if (row.count_sale_old == row.count_buff) return "bg-green-2";
    },
    headerClasses: "bg-orange-2",
  },
  {
    name: "article",
    label: "Артикул в пек.",
    align: "left",
    field: "article",
    required: true, // нельзя выключить
    sortable: true,
    classes: (row) => {
      if (!row.article) return "bg-red-2";
      if (row.article_original == row.article_buff) return "bg-green-2";
    },
  },

  {
    name: "hidden",
    label: "Скрыто",
    align: "center",
    field: "hidden",
    sortable: true,
    hidden: true,
  },
  {
    name: "count_sale", //!!!!!!!!!!!!!!
    label: "Кол-во ∑",
    align: "right",
    field: "count_sale",
    required: true, // нельзя выключить
    sortable: true,
    hidden: true,
  },
  {
    name: "tovar_name",
    label: "Товар",
    align: "left",
    field: "tovar_name",
    sortable: true,
  },
  {
    name: "cena",
    label: "Цена",
    align: "right",
    field: "cena",
    sortable: true,
    hidden: true,
  },
  {
    name: "productvid_name",
    label: "Продукт",
    align: "left",
    field: "productvid_name",
    sortable: true,
    hidden: true,
  },
  // {
  //   name: "bakery_name",
  //   label: "Пекарня",
  //   align: "left",
  //   field: "bakery_name",
  //   sortable: true,
  //   hidden: false,
  // },
  {
    name: "trademark_name",
    label: "Сеть",
    align: "left",
    field: "trademark_name",
    sortable: true,
    hidden: true,
  },
  {
    name: "date_start",
    label: "Дата док.",
    align: "left",
    field: "date_start",
    sortable: true,
    hidden: false,
  },
  {
    name: "price_docnum",
    label: "Номер док.",
    align: "left",
    field: "price_docnum",
    sortable: true,
    hidden: true,
  },
  /////
  // {
  //   name: "kagent_name",
  //   label: "Контрагент",
  //   align: "left",
  //   field: "kagent_name",
  //   sortable: true,
  //   hidden: false,
  // },
  // {
  //   name: "kagent_own_name",
  //   label: "Кагент свой",
  //   align: "left",
  //   field: "kagent_own_name",
  //   sortable: true,
  //   hidden: false,
  // },
  // {
  //   name: "kagent_franch_name",
  //   label: "франчайзи",
  //   align: "left",
  //   field: "kagent_franch_name",
  //   sortable: true,
  //   hidden: false,
  // },
];

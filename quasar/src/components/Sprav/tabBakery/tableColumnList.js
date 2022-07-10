
export const columns = [
  {
    name: "name",
    label: "Пекарня",
    align: "left",
    field: "name",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "bakery_manager_name",
    label: "менеджер пек.",
    align: "left",
    field: "bakery_manager_name",
    sortable: true,
  },
  {
    name: "region_name",
    label: "Регион",
    align: "left",
    field: "region_name",
    sortable: true,
    //  hidden: true,
  },
  {
    name: "region_manager_name",
    label: "Рег.менеджер",
    align: "left",
    field: "region_manager_name",
    sortable: true,
  },
  {
    name: "territory_name",
    label: "Территория",
    align: "left",
    field: "territory_name",
    sortable: true,
  },
  {
    name: "territory_manager_name",
    label: "Терр.менеджер",
    align: "left",
    field: "territory_manager_name",
    sortable: true,
  },
  // {
  //   name: "bakery_count",
  //   label: "Пекарни",
  //   align: "left",
  //   field: "bakery_count",
  //   required: true,
  //   sortable: true,
  // },
];

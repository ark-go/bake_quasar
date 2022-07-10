export const columns = [
  {
    name: "name",
    label: "Территория",
    align: "left",
    field: "name",
    required: true,
    sortable: true,
  },

  {
    name: "territory_manager_name",
    label: "Терр.менеджер",
    align: "left",
    field: "territory_manager_name",
    sortable: true,
  },
  {
    name: "region_name",
    label: "Регион",
    align: "left",
    field: "region_name",
    sortable: true,
  },
  {
    name: "region_manager_name",
    label: "Рег.менеджер",
    align: "left",
    field: "region_manager_name",
    sortable: true,
  },
  {
    name: "bakery_count",
    label: "Пекарни шт.",
    align: "right",
    field: "bakery_count",
    sortable: true,
  },
];

export const columnsVisible = [
  "user_email",
  "user_date",
  "region_name",
  "address",
  "dateopen",
  "dateclose",
  "area",
  "kolbakers",
  "description",
  "territory_name",
];
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
    name: "region_name",
    label: "Регион",
    align: "left",
    field: "region_name",
    required: true,
    sortable: true,
  },
  {
    name: "bakery_count",
    label: "Пекарни",
    align: "left",
    field: "bakery_count",
    required: true,
    sortable: true,
  },
];

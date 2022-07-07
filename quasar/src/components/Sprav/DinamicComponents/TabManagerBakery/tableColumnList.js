export const columnsVisibleTemplate = [
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
    label: "Пекарь",
    align: "left",
    field: "name",
    required: true,
    sortable: true,
  },
  {
    name: "bakery_name",
    label: "Пекарня",
    align: "left",
    field: "bakery_name",
    required: true,
    sortable: true,
  },
  {
    name: "date_on",
    label: "с даты",
    align: "left",
    field: "date_on",
    required: true,
    sortable: true,
  },
  {
    name: "territory_name",
    label: "Территория",
    align: "left",
    field: "territory_name",
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
];

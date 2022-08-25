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
    name: "datestart_str",
    label: "В сети",
    align: "left",
    field: "datestart_str",
    sortable: true,
  },
  {
    name: "date_end",
    label: "Удалена",
    align: "left",
    field: "date_end",
    sortable: true,
    hidden: false,
  },
  {
    name: "territory_name",
    label: "Территория",
    align: "left",
    field: "territory_name",
    sortable: true,
    hidden: false,
  },
];

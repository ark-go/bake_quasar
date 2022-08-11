export const columns = [
  {
    name: "datestart",
    label: "Дата",
    align: "left",
    field: "datestart",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "docnum",
    label: "№ док.",
    align: "left",
    field: "docnum",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "trademark_name",
    label: "Торг.сеть",
    align: "left",
    field: "trademark_name",
    sortable: true,
  },
  {
    name: "kagent_name",
    label: "Контрагент",
    align: "left",
    field: "kagent_name",
    sortable: true,
  },
  {
    name: "kagent_own_name",
    label: "Свой к/агент",
    align: "left",
    field: "kagent_own_name",
    sortable: true,
  },
  {
    name: "pricevid_name",
    label: "Вид док.",
    align: "left",
    field: "pricevid_name",
    sortable: true,
  },
];

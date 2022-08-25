export const columns = [
  {
    name: "name",
    label: "Название",
    align: "left",
    field: "name",
    required: true, // нельзя выключить
    sortable: true,
    format: (val) => `${val}`,
  },
  {
    name: "date_sale",
    label: "X",
    align: "left",
    field: "date_sale",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "region_name",
    label: "Регион",
    align: "left",
    field: "region_name",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "territory_name",
    label: "Территория",
    align: "left",
    field: "territory_name",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "city_name",
    label: "Город",
    align: "left",
    field: "city_name",
    sortable: true,
  },
  {
    name: "kagent_name",
    label: "Кагент",
    align: "left",
    field: "kagent_name",
    required: true, // нельзя выключить
    sortable: true,
  },
  {
    name: "kagent_own_name",
    label: "Соб.кагент",
    align: "left",
    field: "kagent_own_name",
    sortable: true,
  },
  {
    name: "kagent_franch_name",
    label: "Франчайзи",
    align: "left",
    field: "kagent_franch_name",
    sortable: true,
  },
  {
    name: "trademark_name",
    label: "Торг.сеть",
    align: "left",
    field: "trademark_name",
    sortable: true,
    //  hidden: true,
  },
];

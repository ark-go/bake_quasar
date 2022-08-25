const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/PageStart/PageStart.vue"),
        meta: { title: "Главная" },
      },
      {
        path: "test",
        component: () => import("pages/PageTest.vue"),
      },
      {
        path: "departments",
        component: () => import("components/Users/PageUsersTree.vue"),
        meta: { title: "Пользователи" },
      },
      {
        path: "registration/:id?/:code?",
        name: "registration",
        props: true,
        component: () => import("components/Registration/PageRegistration.vue"),
        meta: { title: "Регистрация" },
      },
      {
        path: "charts",
        component: () => import("pages/PageCharts.vue"),
      },
      { path: "tables2", component: () => import("pages/Tables.vue") },
      {
        path: "login",
        component: () => import("pages/PageLogin.vue"),
      },
      {
        path: "nomencl",
        component: () => import("pages/PageNomencl.vue"),
      },
      {
        path: "photo",
        component: () => import("pages/PagePhoto.vue"),
      },
      {
        path: "prodaja",
        component: () => import("pages/PageProdaja.vue"),
        meta: { title: "Продажи" },
      },
      {
        path: "specstore",
        component: () => import("pages/PageSpecStore.vue"),
      },
      {
        path: "spravochnik",
        component: () => import("components/Sprav/PageSprav.vue"),
        meta: { title: "Справочник" },
      },
      // {
      //   path: "price",
      //   component: () => import("components/Price/PagePrice.vue"),
      //   meta: { title: "Прайсы" },
      // },
      {
        path: "sale",
        component: () => import("components/Sale/PageSale.vue"),
        meta: { title: "Продажи" },
      },
      {
        path: "kagent",
        component: () => import("components/Kagent/PageKagent.vue"),
        meta: { title: "Контрагенты" },
      },
      {
        path: "bakery",
        component: () => import("components/Bakery/PageBakery.vue"),
        meta: { title: "Пекарни" },
      },
      {
        path: "products",
        component: () => import("components/Products/PageProducts.vue"),
        meta: { title: "Продукция" },
      },
      {
        path: "docprice",
        component: () => import("components/Docprice/PageDocprice.vue"),
        meta: { title: "Прайс" },
      },
      {
        path: "bakeryttk",
        component: () => import("components/BakeryTTK/PageBakeryTTK.vue"),
        meta: { title: "Продукты" },
      },
      {
        path: "xls",
        component: () => import("pages/PageXls.vue"),
      },
      {
        path: "parsery",
        component: () => import("components/testParser/PageParser.vue"),
      },
    ],
  },
  {
    path: "/price",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/Price/PagePrice.vue"),
        meta: { title: "Прайсы" },
      },
    ],
  },
  {
    path: "/tables",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PageTabs.vue") },
      { path: "users", component: () => import("pages/PageTabUsers.vue") },
      {
        path: "bakehouses",
        component: () => import("pages/PageTabBakehouses.vue"),
      },
      {
        path: "nomencl",
        component: () => import("pages/PageTabNomenclature.vue"),
      },
      {
        path: "partners",
        component: () => import("pages/PageTabPartners.vue"),
      },
      {
        path: "csv",
        component: () => import("pages/PageConvertCSV.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];
// {
//   path: "/departments",
//   component: () => import("layouts/MainLayout.vue"),
//   children: [
//     {
//       path: "",
//       component: () => import("components/Departments/PageDepartments.vue"),
//     },
//   ],
// },
// {
//   path: "/pdf",
//   component: () => import("layouts/MainLayout.vue"),
//   children: [
//     {
//       path: "",
//       component: () => import("components/PDF/PagePdf.vue"),
//       children: [
//         {
//           path: "pricelist/:cmd",
//           props: true,
//           component: () => import("components/PDF/PriceList.vue"),
//         },
//         {
//           path: "pricelist",
//           name: "pricelist",
//           props: true,
//           component: () => import("components/PDF/PriceListMenu.vue"),
//         },
//         {
//           path: "products/:id",
//           props: true,
//           component: () => import("components/PDF/ProductsPdf.vue"),
//         },
//         {
//           path: "products",
//           name: "products",
//           props: true,
//           component: () => import("components/PDF/ProductsPdf.vue"),
//         },
//       ],
//     },
//   ],
// },
// {
//   path: "/pdf",
//   name: "pdf",
//   props: true,
//   component: () => import("pages/PagePdf.vue"),
// },
export default routes;

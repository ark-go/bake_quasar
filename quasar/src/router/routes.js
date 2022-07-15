const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/PageStart/PageStart.vue"),
      },
      {
        path: "test",
        component: () => import("pages/PageTest.vue"),
      },
      {
        path: "departments",
        component: () => import("components/Users/PageUsersTree.vue"),
      },
      {
        path: "registration/:id?/:code?",
        name: "registration",
        props: true,
        component: () => import("components/Registration/PageRegistration.vue"),
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
      },
      {
        path: "specstore",
        component: () => import("pages/PageSpecStore.vue"),
      },
      {
        path: "spravochnik",
        component: () => import("components/Sprav/PageSprav.vue"),
      },
      {
        path: "kagent",
        component: () => import("components/Kagent/PageKagent.vue"),
      },
      {
        path: "bakery",
        component: () => import("components/Bakery/PageBakery.vue"),
      },
      {
        path: "products",
        component: () => import("components/Products/PageProducts.vue"),
      },
      {
        path: "docprice",
        component: () => import("components/Docprice/PageDocprice.vue"),
      },
      {
        path: "bakeryttk",
        component: () => import("components/BakeryTTK/PageBakeryTTK.vue"),
      },
      {
        path: "xls",
        component: () => import("pages/PageXls.vue"),
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

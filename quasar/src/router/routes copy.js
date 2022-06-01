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
        path: "departments",
        component: () => import("components/Departments/PageDepartments.vue"),
      },
    ],
  },
  {
    path: "/registration/:id?/:code?",
    props: true,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "registration",
        props: true,
        component: () => import("components/Registration/PageRegistration.vue"),
      },
    ],
  },
  {
    path: "/charts",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PageCharts.vue") }],
  },
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
  {
    path: "/tables2",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Tables.vue") }],
  },
  {
    path: "/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PageLogin.vue") }],
  },
  {
    path: "/nomencl",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PageNomencl.vue") }],
  },
  {
    path: "/photo",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PagePhoto.vue") }],
  },
  {
    path: "/prodaja",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PageProdaja.vue") }],
  },
  {
    path: "/specstore",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PageSpecStore.vue") },
    ],
  },
  {
    path: "/spravochnik",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("components/Sprav/PageSprav.vue") },
    ],
  },
  {
    path: "/kagent",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("components/Kagent/PageKagent.vue") },
    ],
  },
  {
    path: "/bakery",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("components/Bakery/PageBakery.vue") },
    ],
  },
  {
    path: "/products",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/Products/PageProducts.vue"),
      },
    ],
  },
  {
    path: "/docprice",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/Docprice/PageDocprice.vue"),
      },
    ],
  },
  {
    path: "/bakeryttk",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("components/BakeryTTK/PageBakeryTTK.vue"),
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
  {
    path: "/xls",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/PageXls.vue") }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;

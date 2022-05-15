// Подключаем собственный магазин
import { boot } from "quasar/wrappers";
import { stateSymbol, createState } from "../utils/useState.js";
import { arkVuexSymbol, createArkVuex } from "../utils/arkVuex.js";
export default boot(({ app }) => {
  app.provide(stateSymbol, createState());
  app.provide(arkVuexSymbol, createArkVuex());
  // app.config.globalProperties.$arkVuex = createState; //
});

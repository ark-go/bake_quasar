import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { watch } from "vue";
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  // watch(
  //   pinia.state,
  //   (state) => {
  //     // сохранять все состояние в локальном хранилище всякий раз, когда оно изменяется
  //! нельзя у меня в state хранятся объеты большие например io Socket ?
  //     localStorage.setItem("BakeryState", JSON.stringify(state));
  //   },
  //   { deep: true }
  // );
  return pinia;
});

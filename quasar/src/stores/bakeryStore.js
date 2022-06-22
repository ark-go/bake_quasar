import { defineStore } from "pinia";
//import { useQuasar } from "quasar";
// Спрвочники
export const useBakeryStore = defineStore("BakeryStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      selectedNode: {},
      selectedRow: {},
    };
  },
  // getters: {
  //   isMobile: (state) => {
  // //    let { platform } = useQuasar();
  // //    return platform.is.mobile;
  //   },
  // },
});

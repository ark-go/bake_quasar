import { defineStore } from "pinia";
//import { useQuasar } from "quasar";
// Спрвочники
export const useSpravStore = defineStore("SpravStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      selectedNode: {},
    };
  },
  // getters: {
  //   isMobile: (state) => {
  // //    let { platform } = useQuasar();
  // //    return platform.is.mobile;
  //   },
  // },
});

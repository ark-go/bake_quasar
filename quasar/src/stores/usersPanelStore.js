import { defineStore } from "pinia";
//import { useQuasar } from "quasar";
// Спрвочники
export const useUsersPanelStore = defineStore("UsersPanelStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      userRow: {},
      treeRow: {},
    };
  },
  // getters: {
  //   isMobile: (state) => {
  // //    let { platform } = useQuasar();
  // //    return platform.is.mobile;
  //   },
  // },
});

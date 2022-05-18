import { defineStore } from "pinia";

export const useMainStore = defineStore("MainStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически

      rightDrawerOpen: false,
      leftDrawerOpen: false,
    };
  },
});

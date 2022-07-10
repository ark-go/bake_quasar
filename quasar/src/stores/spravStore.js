import { defineStore } from "pinia";
//import { useQuasar } from "quasar";
// Спрвочники
export const useSpravStore = defineStore("SpravStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      /**
       * Выбранный узел в дереве, в нем и таблица
       */
      selectedNode: {},
      /**
       * выбраная строка в таблице, относительно selectedNode
       */
      selectedRow: {},
      /**
       * дата для использования истории, временно
       */
      historyDate: null,
      /**
       * выбранная вкладка
       */
      currentTab: "",
    };
  },
  // getters: {
  //   isMobile: (state) => {
  // //    let { platform } = useQuasar();
  // //    return platform.is.mobile;
  //   },
  // },
});

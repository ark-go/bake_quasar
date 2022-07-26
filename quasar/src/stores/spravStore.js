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
       * Включение режима истории
       */
      // historyOn: false,
      /**
       * выбранная вкладка
       */
      currentTab: "",
    };
  },

  getters: {
    /**
     * Уточнить точно ли это надоа
     * @param {*} state
     * @returns
     */
    historyOn: (state) => {
      console.log(">>>>!>>>", state.currentTab, ">>", state.selectedRow);
      if (!Object.keys(state.selectedRow).length) {
        // строка не выбрана
        return true;
      } else if (!state.currentTab || state.currentTab == "main") {
        // и строка выбрана вкладка main, или ваще никакая не выбрана
        return true;
      }

      return false;
    },

    //   isMobile: (state) => {
    // //    let { platform } = useQuasar();
    // //    return platform.is.mobile;
    //   },
  },
});

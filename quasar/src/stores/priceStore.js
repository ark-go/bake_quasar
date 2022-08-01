import { defineStore } from "pinia";
export { storeToRefs } from "pinia";
//import { useQuasar } from "quasar";
// Спрвочники
export const usePriceStore = defineStore("PriceStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      /**
       * Выбранный документ торговой сети
       */
      selectedDoc: {},
      /**
       * выбраная строка в таблице, относительно selectedNode
       */
      // selectedRow: {},
      /**
       * дата для использования истории, временно
       */
      // historyDate: null,
      /**
       * выбранная вкладка
       */
      currentTab: "",
    };
  },

  getters: {},
});

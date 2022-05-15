import { defineStore } from "pinia";

export const useDocPrice = defineStore("docPrice", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически

      /**
       *  Row текущий, подсвеченный документ
       *  весь документ
       */
      currRowDoc: {},
      /**
       * Array,
       *  Выбранные ID пекарен
       */
      //selectedBakes: [], //! Не используем [ID] выбранные пекарни
      /**
       * Текущая панель, название
       */
      currPanelName: "",
      /**
       * текущий, выбранный товар в прайс-листе
       */
      currRowPrice: {},
      /**
       * текущая, выбранная пекарня
       */
      currRowBakery: 0,
    };
  },
});

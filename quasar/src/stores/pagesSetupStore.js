import { defineStore } from "pinia";
export { storeToRefs } from "pinia";
import { Notify } from "quasar";
/**
 * Настройки страницы для пользователя
 */
export const usePagesSetupStore = defineStore("PagesSetupStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      /**
       * Установка формы для страницы
       */
      currentPage: "",
      // cardMain: {
      //   width: {
      //     curr: 704,
      //     min: 360,
      //     max: 1200,
      //   },
      // },
      page: {
        docPrice: {
          width: {
            curr: 700,
            min: 360,
            max: 1200,
          },
          columnDocDocument: [],
          rowsPerPage: {
            curr: 10,
            min: 3,
            max: 30,
          },
        },
        products: {
          width: {
            curr: 700,
            min: 360,
            max: 1200,
          },
          rowsPerPage: {
            curr: 10,
            min: 3,
            max: 30,
          },
        },
        defaultPage: {
          width: {
            curr: 700,
            min: 360,
            max: 1200,
          },
          columnDocDocument: [],
          rowsPerPage: {
            curr: 10,
            min: 7,
            max: 30,
          },
        },
      },
    };
  },
  actions: {
    async savePageSetup() {
      // по кнопке сохраняем все сразу.
      //this.counter++;
    },
    async loadPageSetup() {
      // загружать при монтировании слоя Main layout
    },
    resetPageSetup() {
      Notify.create({
        color: "green",
        position: "top",
        message: "Не работает",
        icon: "",
      });
    },
  },

  getters: {
    cardMain: (state) => {
      switch (state.currentPage) {
        case "docPrice":
          return state.page.docPrice;
        case "products":
          return state.page.products;
        default:
          return state.page.defaultPage;
      }
    },
  },
});

import { defineStore } from "pinia";
export { storeToRefs } from "pinia";
//import { useQuasar } from "quasar";
// Спрвочники
export const useSaleStore = defineStore("SaleStore", {
  state: () => {
    return {
      //все эти свойства будут иметь свой тип автоматически
      /**
       * Выбранная пекарня
       */
      bakerySelectedRow: {},
      /**
       * список пекарен для сети
       */
      bakeryRows: [],
      /**
       * список Торговых сетей
       */
      trademarkRows: [],
      /**
       * выбранный id trademark
       */
      trademarkId: 0,
      /**
       * выбранный id bakery пекарни
       */
      bakeryId: 0,
      /**
       * выбранный диапазон дат для  выбора пекарен
       */
      selectedDateBetweenBakery: {
        from: "",
        to: "",
      },
      /**
       * Загруженные артикулы по печке
       */
      articleBakeryRows: [],
      /**
       * Выбранная строка в артикулах пекарни
       * id  от таблицы price_value id
       */
      selectedArticleBakeryRow: {},
      /**
       * указатель на таблицу с артикулами
       */
      refTableArticle: null,
      /**
       * Показать скрытые артикулы для пекарни
       */
      showHiddenArticle: false,
      // --------------
      /**
       * Выбранная дата продажи
       */
      currentDateSale: "",
      /**
       * выбор даты разрешен
       */
      checkDateSale: false,
      /**
       * не даем часто нажимать на кнопку
       */
      debonceArticleOn: true,
      debonceAddCountOn: true,
      /**
       * собираем Watch-еры, для остановки
       */
      watchForStop: [],
      /**
       *
       */
      tabModel: "main",
      /**
       * размер тела ArkCard
       */
      maxBodyHeight: "",
      maxBodyHeightResize: false,

      currentTab: "",
    };
  },

  getters: {
    /**
     *  Титул окна
     */
    saleTitle: (state) => {
      let title = "Продажи";
      let trademark = state.trademarkRows.find((val) => {
        return val.id == state.trademarkId;
      });
      if (trademark) {
        title += ": " + trademark.name;
      }
      if (state.bakerySelectedRow?.id) {
        title += " | " + state.bakerySelectedRow.name;
      }

      return title;
    },
    saleSubTitle: (state) => {
      let title = "";
      if (state.selectedDateBetweenBakery.from) {
        title += `Диапазон дат: ${state.selectedDateBetweenBakery.from}-${state.selectedDateBetweenBakery.to}`;
      }
      return title;
    },
    saleArticleTitle: (state) => {
      let title = "Артикулы: ";
      if (state.bakerySelectedRow?.name) {
        title += state.bakerySelectedRow.name;
      } else {
        title += "Выберите пекарню.";
      }
      if (state.checkDateSale && state.currentDateSale) {
        title += " | " + state.currentDateSale;
      } else if (state.selectedDateBetweenBakery.to) {
        title += ` | ${state.selectedDateBetweenBakery.from} - ${state.selectedDateBetweenBakery.to}`;
      } else {
        title += " | Выберите дату.";
      }
      return title;
    },
  },
  actions: {
    /**
     * debonce задержка повторов
     */
    debonceArticle(calback) {
      if (this.debonceArticleOn) {
        calback();
        setTimeout(() => {
          this.debonceArticleOn = true;
        }, 1500);
      }
      this.debonceArticleOn = false;
    },
    debonceAddCount(calback) {
      if (this.debonceAddCountOn) {
        calback();
        setTimeout(() => {
          this.debonceAddCountOn = true;
        }, 1500);
      }
      this.debonceAddCountOn = false;
    },
    watchStore(callback) {
      let h = callback();
      console.log("add watch", h);
      this.watchForStop.push(h);
    },
    watchStop() {
      this.watchForStop.forEach((v, i) => {
        try {
          v();
          console.log("watch delete price - ", i);
        } catch (e) {
          console.log("stop watch price - ", i);
        }
      });
    },
  },
});

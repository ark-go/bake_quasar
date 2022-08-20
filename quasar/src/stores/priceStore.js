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
      selectedRowDoc: {},
      /**
       * Кол-во пекарен в прайсе
       */
      bakeryCount: 0,
      /**
       * Выбраная печка прайса
       */
      selectedRowBakery: {},
      /**
       *  печки выбираемые в модально окне для добавления
       */
      selectedBakeryModal: [],
      /**
       * Все пекарни прайса таблица
       */
      RowsBakeryPrice: [],
      /**
       * Все документы  таблица
       */
      RowsDocuments: [],
      /**
       * Весь прайс документа  таблица price_Value
       */
      RowsPriceValue: [],
      /**
       * печки выбранные в прайсе
       */
      selectedBakeryPrice: [],
      /**
       * Показывает всплывающее окно, для выбора печек
       */
      selectBakeryShow: false,
      /**
       *  прайс ценники, таблица price_Value
       */
      //  дубль RowsPriceValue: [],
      /**
       * Выбранная строка прайса с ценами
       */
      selectedRowPrice: {},
      /**
       * Кол-во позиций в прайсе
       */
      priceValueCount: 0,
      /**
       * текущие пекарни всех вранчайзи из прайса
       */
      bakeryFranchPrice: [],
      /**
       * Выбраные печки франчайзи, для изменения цен
       */
      selectedFranchPrice: [],
      /**
       * дата для использования истории, временно
       */
      // historyDate: null,
      watchForStop: [],
      /**
       * выбранная вкладка
       */
      tabModel: "main",
      /**
       * keepAlive
       */
      keepAlive: false,
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
    priceTitle: (state) => {
      let title = "";
      if (state.selectedRowDoc.id) {
        title = state.selectedRowDoc.datestart;
        title += state.selectedRowDoc.docnum
          ? " • " + state.selectedRowDoc.docnum // алт+0149
          : "";
        title += state.selectedRowDoc.trademark_name
          ? " • " + state.selectedRowDoc.trademark_name
          : "";
        title += state.selectedRowDoc.kagent_name
          ? " • " + state.selectedRowDoc.kagent_name
          : "";
        title += state.selectedRowDoc.kagent_own_name
          ? " • " + state.selectedRowDoc.kagent_own_name
          : "";
        title += state.selectedRowBakery.bakery_name
          ? " • " + state.selectedRowBakery.bakery_name
          : "";
        title += state.selectedRowBakery.kagent_franch_name
          ? " (аренда:" + state.selectedRowBakery.kagent_franch_name + ")"
          : "";
      }
      return title;
    },
    priceTitleBakeryModal: (state) => {
      let title = "";
      if (state.selectedRowDoc.id) {
        title = state.selectedRowDoc.datestart;
        title += state.selectedRowDoc.docnum
          ? " • " + state.selectedRowDoc.docnum
          : "";
        title += state.selectedRowDoc.trademark_name
          ? " • " + state.selectedRowDoc.trademark_name
          : "";
        title += state.selectedRowDoc.kagent_name
          ? " • " + state.selectedRowDoc.kagent_name
          : "";
        title += state.selectedRowDoc.kagent_own_name
          ? " • " + state.selectedRowDoc.kagent_own_name
          : "";
      }
      return title;
    },
  },
  actions: {
    watchStore(callback) {
      let h = callback();
      console.log("add watch", h);
      this.watchForStop.push(h);
    },
    watchStop() {
      this.watchForStop.forEach((v, i) => {
        try {
          v();
        } catch (e) {
          console.log("stop watch - ", i);
        }
      });
    },
  },
});

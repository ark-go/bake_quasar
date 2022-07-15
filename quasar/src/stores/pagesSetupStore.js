import { defineStore } from "pinia";
export { storeToRefs } from "pinia";
import merge from "merge";
import { Notify } from "quasar";
import { nextTick, ref, toRefs } from "vue";
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
      pageOffset: 100,
      pageHeight: 200,
      pagePaddingY: 60,

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
          fontSize: {
            curr: 14,
            min: 9,
            max: 25,
          },
        },
        usersTree: {
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
          fontSize: {
            curr: 14,
            min: 9,
            max: 25,
          },
        },
        /**
         * Форма справочники
         */
        sprav: {
          width: {
            curr: 700,
            min: 360,
            max: 1400,
          },
          rowsPerPage: {
            curr: 10,
            min: 3,
            max: 30,
          },
          fontSize: {
            curr: 14,
            min: 9,
            max: 25,
          },
        },
        defaultPage: {
          width: {
            curr: 700,
            min: 360,
            max: 1200,
          },
          fontSize: {
            curr: 14,
            min: 9,
            max: 25,
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
    resetPageSetup() {},
  },

  getters: {
    cardMain: (state) => {
      switch (state.currentPage) {
        case "docPrice":
          return state.page.docPrice;
        case "products":
          return state.page.products;
        case "sprav":
          return state.page.sprav;
        case "usersTree":
          return state.page.usersTree;
        default:
          return state.page.defaultPage;
      }
    },
    /**Рабочий размер Height для ArkCard с padding  ( pagePaddingY )*/
    arkCardHeight: (state) => {
      // вычичслим зону
      return state.pageHeight - state.pageOffset - state.pagePaddingY;
    },
  },
});
const pageSetup = usePagesSetupStore();

// прочитаем при загрузке данные из компа
const lockStat = localStorage.getItem("pageSetup");
// внимание надо объединить данные из кода и данные прочитанные из LocalStorage компа
// иначе измененые данные никогда не задействуются, потому что будут переписаны из компьютера
if (lockStat) {
  // для глубокого слияния используем модуль merge
  let mergeLockComp = merge.recursive(
    true,
    pageSetup.$state,
    JSON.parse(localStorage.getItem("pageSetup"))
  );
  // заносим данные из кода и и данные из LocalStorage компьютера в наш магазин
  pageSetup.$state = mergeLockComp;
}
// подписываемся на события и сохраняем при изменение в локальный комп
pageSetup.$subscribe((mutation, state) => {
  if (state.page[state.currentPage]?.resetStoreUser) {
    let buf = state.currentPage; // запомним текущюю страницу
    Notify.create({
      color: "silver",
      textColor: "white",
      icon: "reset_tv",
      message: "Сбросить настройки экрана?",
      caption: "Будут установлены настройки по умолчанию.",
      position: "center",
      // avatar,
      multiLine: true,
      timeout: 0,
      actions: [
        {
          label: "Сброс",
          color: "orange-9",
          handler: () => {
            localStorage.removeItem("pageSetup");
            pageSetup.$reset();
            state.currentPage = buf; // восстановитьпосле сброса текущую страницу
            // в этом же тике запишем нашу текущюю страницу обратно в LocalStorage
            // иначе после сброса, не получается :)
            localStorage.setItem("pageSetup", JSON.stringify(state));
          },
        },
        {
          label: "Не хочу",
          color: "green",
          handler: () => {
            // раз отказались то вернем ключ сброса на место;
            state.page[state.currentPage].resetStoreUser = false; //
            /* console.log('wooow') */
          },
        },
      ],
    });
    // pageSetup.$reset();
    // state.currentPage = buf;
  }
  localStorage.setItem("pageSetup", JSON.stringify(state));
});

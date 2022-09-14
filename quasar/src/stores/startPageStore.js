import { defineStore } from "pinia";
export { storeToRefs } from "pinia";
import { ref, toRaw } from "vue";
import merge from "merge";
//import { Notify, useQuasar, Platform, Screen } from "quasar";
//let $q = useQuasar();
//import { nextTick, unref, ref, toRefs } from "vue";
/**
 * Настройки страницы для пользователя
 */
export const useStartPageStore = defineStore("StartPageStore", {
  state: () => {
    return {
      listMenuDef: [
        {
          id: 1,
          header: "Ввод данных",
          visible: true,
        },
        {
          id: 2,
          title: "Продажи",
          link: "/sale",
          icon: "arrow_right",
          visible: true,
        },
        {
          id: 3,
          title: "Продукция<br>рецепты по ТТК",
          link: "/products",
          icon: "arrow_right",
          visible: true,
        },
        {
          id: 4,
          title: "Документы<br>прайсы",
          link: "/price",
          icon: "arrow_right",
          visible: true,
        },
        {
          id: 5,
          header: "Отчеты",
          visible: true,
        },
        {
          id: 6,
          title: "Chart",
          link: "/charts/3",
          icon: "bar_chart",
          visible: true,
        },
        {
          id: 7,
          header: "Справочники",
          visible: true,
        },
        {
          id: 8,
          title: "Пекарни",
          link: "/bakery",
          icon: "arrow_right",
          visible: true,
        },
        {
          id: 9,
          title: "Контрагенты",
          link: "/kagent",
          icon: "arrow_right",
          visible: true,
        },
        {
          id: 10,
          title: "Продукция",
          link: "/products",
          icon: "arrow_right",
          visible: true,
          hiddenMenuCard: true, //  скрываем из кнопок на экране
        },
        {
          id: 11,
          header: "Администрирование",
          visible: true,
        },
        {
          id: 12,
          title: "Пекарни<br>конфигурация",
          link: "/spravochnik",
          icon: "arrow_right",
          visible: true,
        },
        {
          id: 13,
          title: "Пользователи<br>управляющие",
          link: "/departments",
          icon: "arrow_right",
          visible: true,
        },
      ],
      listMenu: [],
      listMenuSorted: [],
      toggleStorage: "13-09-2022-2",
      //  listMenu: [],
    };
  },
  actions: {
    // async setListMenu(listMenu) {
    //   console.log(">>>>>123>>", listMenu);
    //   this.listMenu = { ...listMenu };
    // },

    async savePageStart() {
      // по кнопке сохраняем все сразу.
      //this.counter++;
    },
    async loadPageStart() {
      // загружать при монтировании слоя Main layout
    },
    resetPageStart() {},
  },

  getters: {
    listMenuSide: (state) => {
      let buffList = [...state.listMenuDef]; //.copyWithin(-1);
      state.listMenuSorted = ref(buffList);
      console.log("listMenuSide", buffList);
      //return buffList.sort(sortMenu);
      return state.listMenuSorted.sort(sortMenu); //state.listMenu;
    },
    // listMenu: (state) => {
    //   return {
    //     ...copyObject(state.listMenuDefault),
    //     ...state.listMenu,
    //   };
    // },
    /**Рабочий размер Height для ArkCard с padding  ( pagePaddingY )*/
    // arkCardHeight: (state) => {
    //   // вычичслим зону
    //   return state.pageHeight - state.pageOffset - state.pagePaddingY;
    // },
  },
});

// для сортировки меню по id
function sortMenu(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}
function copyObject(o) {
  // глубокое копиование ?
  if (o === null) return null;
  var output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = typeof v === "object" ? copyObject(v) : v;
  }
  return output;
}
const pageStart = useStartPageStore();
pageStart.$state.listMenu = pageStart.$state.listMenuDef.filter(
  (val) => !val.header
);
console.log(">D>D>D>D>", pageStart.$state.listMenu);
// прочитаем при загрузке данные из компа
const lockStat = localStorage.getItem("pageStart");
// внимание надо объединить данные из кода и данные прочитанные из LocalStorage компа
// иначе измененые данные никогда не задействуются, потому что будут переписаны из компьютера
if (lockStat) {
  let stor = JSON.parse(localStorage.getItem("pageStart"));
  if (pageStart.$state.toggleStorage == stor.toggleStorage) {
    // для глубокого слияния используем модуль merge
    let mergeLockComp = merge.recursive(true, pageStart.$state, stor);
    // заносим данные из кода и и данные из LocalStorage компьютера в наш магазин
    pageStart.$state = mergeLockComp;
  }
}
// подписываемся на события и сохраняем при изменение в локальный комп
pageStart.$subscribe((mutation, state) => {
  // if (state.page[state.currentPage]?.resetStoreUser) {
  //   let buf = state.currentPage; // запомним текущюю страницу
  // }
  localStorage.setItem("pageStart", JSON.stringify(state));
});

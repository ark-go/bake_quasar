import { reactive, provide, inject, readonly, toRefs } from "vue";

// export const Task = {
//   id: number,
//   name: string,
//   due: Date,
//   done: boolean,
// };

class State {
  vidStore = ["city"];
  setVidStore(val) {
    this.vidStore = val;
  }
  loading = "Привет !";
  get getLoading() {
    return this.loading;
  }
}

const vidTable = {
  _store: [],
  get store() {
    return this._store;
  },
  set store(val) {
    this._store = val;
  },
  _specDocStore: [],
  get specDocStore() {
    return this._specDocStore;
  },
  set specDocStore(val) {
    this._specDocStore = val;
  },
  _storeBuiltIn: [], // дети, Вид столбцов таблица при раскрытии группы магазинов
  get storeBuiltIn() {
    return this._storeBuiltIn;
  },
  set storeBuiltIn(val) {
    this._storeBuiltIn = val;
  },
  _dataStoreBuiltIn: [], // дети, Данные из базы таблиц при раскрытии группы магазинов
  get dataStoreBuiltIn() {
    return this._dataStoreBuiltIn;
  },
  set dataStoreBuiltIn(val) {
    this._dataStoreBuiltIn = val;
  },
  _kagentDialog: [], // не использовал
  get kagentDialog() {
    return this._kagentDialog;
  },
  set kagentDialog(val) {
    this._kagentDialog = val;
  },
};
// ------  для хранения выбранных строк из таблиц, таблицы по имени переменной
const selectedRowsVuex = {
  _products: {},
  get products() {
    return this._products;
  },
  set products(val) {
    this._products = val;
  },
};

export const stateSymbol = Symbol("state");
export const createState = () => {
  return {
    vidTable: reactive(vidTable),
    state: reactive(new State()),
    selectedRowsVuex: reactive(selectedRowsVuex),
  };
  //return readonly(reactive(new State()));
};

export const useState = () => inject(stateSymbol);
//export const provideState = () => provide(stateSymbol, createState());

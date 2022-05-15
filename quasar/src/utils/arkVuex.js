import { reactive, inject } from "vue";

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

const currentRow = {
  _products: [],
  get products() {
    return this._products;
  },
  set products(val) {
    this._products = val;
  },
};
const pdfWindow = {
  _command: { show: false },
  get command() {
    return this._command;
  },
  set command(val) {
    this._command = val;
  },
  _show: false,
  get show() {
    return this._show;
  },
  set show(val) {
    this._show = val;
  },
};
// будем создавать app.provide(arkVuexSymbol, createArkVuex());  в другом файле при загрузке bot
export const arkVuexSymbol = Symbol("selected");
export const createArkVuex = () => {
  return {
    selectedRowsVuex: reactive(selectedRowsVuex),
    pdfWindow: reactive(pdfWindow), // окно PDF в body
    currentRow: reactive(currentRow),
  };
};

export const arkVuex = () => inject(arkVuexSymbol);

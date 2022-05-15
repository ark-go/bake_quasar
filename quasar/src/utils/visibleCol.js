import { computed } from "vue";
import { useState } from "src/utils/useState.js";

/**
 *
 * @param {string} storeName зеачение элемента в arkStore (мой vuex)
 * @param {[] | string} vidColumns Какие столбцы показывать
 * @param {[]|string} requiredColumn Какие столбцы должны быть обязательно
 * @returns {"возвращаем computed"} возвращает реактивное свойство  computed
 *
 * - для всех таблиц
 * - обработка свойства q-table visibleColumns
 * - используем в:  v-model = visibleCol()
 * - данные храним в store по ключу storeName (src/utils/useState.js)
 * - если есть vidColumns но нет requiredColumn то не даст убрать все столбцы
 *
 */

export function visibleCol(
  storeName = "",
  vidColumns = [],
  requiredColumn = []
) {
  const { vidTable } = useState();
  // если строка придет переведем в Array
  if (typeof vidColumns == "string") vidColumns = vidColumns.split(",");
  if (typeof requiredColumn == "string")
    requiredColumn = requiredColumn.split(",");
  if (!Array.isArray(vidColumns) || !Array.isArray(requiredColumn)) {
    console.error(
      "Ошибка типа данных: При обработке visualColumns",
      vidColumns,
      requiredColumn
    );
    return;
  }
  return computed({
    get() {
      // прочитаем что в буфере, там уже все по праилам
      let res = vidTable[storeName];
      if (!res.length) {
        // из буфера ничего нет, пропишем обязательные поля по умолчанию
        // если есть обязательный столбец, то он будет подставлятся всегда
        res = !!vidColumns.length ? vidColumns : requiredColumn;
      }
      // если заданы обязательные поля, то проверим есть ли уже в списке обязательны и добавим их
      requiredColumn.forEach((item) => {
        if (!res.includes(item)) res.push(item);
      });
      // возвращаем что получилось
      return res;
    },
    set(val) {
      // если указаны обязательные столбцы, то он будет подставлятся всегда
      requiredColumn.forEach((item) => {
        if (!val.includes(item)) val.push(item);
      });
      vidTable[storeName] = val; // в arkStore текущее состояние
    },
  });
}

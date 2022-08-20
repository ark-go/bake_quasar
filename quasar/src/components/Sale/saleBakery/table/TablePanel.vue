<!--
    :tableName="tableName" - имя таблицы для обслуживания
    :rows="rows" - [] строки таблицы
    :columns="columns" [] - колонки 
     :tableBodyMenu="tableBodyMenu" - null - компонент, обработки меню правой мыши
    :tableFunc - Function  функция, ее подключаем по месту
    noExpandPanel  - скрыть расширение заголовка для управления
    noTitlePanel  -  скрыть заголовок таблицы
    noTopBtn  - не показывать кнопку с плюсом
    noTopFind - не показывать поле поиска
    noTopColumnSelect - не показывать выбор колонок
    noInfoBtn - убрать кнопку Info из строки
    yesBtnEdit - показывать кнопку редактирования
    yesBtnDelete - показывать кнопку удаления
    noEditTable - удаляет кнопки Edit и Delete и кнопку плюс в Top
    @onInfoRow - по кнопке Инфо
    @onBtnDelete - кнопка удалить в строке
    @onBtnEdit - кнопка едит в строке
    @onRowClick - по строке
    @onAdd - кнопка плюс в заголовке
    :iconBtnEdit="" - иконка для редактирования
    :iconBtnDelete="" - иконка для удаления
    :rowsPerPage  - кол-во строк таблице - странице
-->
<template>
  <Table-Template
    v-if="tableName"
    :title="titleTable"
    :tableName="tableName"
    :rows="bakeryRows"
    :columns="columns"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="$emit('onRowDblClick')"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    @onRowDblClick="$emit('onRowDblClick')"
    :currentRow="bakerySelectedRow"
    noExpandPanel
    noEditTable
    :rowsPerPage="0"
  >
  </Table-Template>
  <div v-else>не указана таблица</div>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  computed,
  watch,
  watchEffect,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";
import { useSaleStore, storeToRefs } from "stores/saleStore.js";
export default defineComponent({
  name: "TablePanel",
  components: {
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
  },
  props: {
    modeBody: {
      type: String,
      default: "view",
    },
    tableName: {
      type: String,
      default: "tabSale", // для запроса с сервера
    },
    title: {
      type: String,
      default: "Пекарни",
    },
    checkSave: Boolean,
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc(props.tableName);
    const titleTable = computed(() => {
      let tr = trademarkRows.value.find((val) => {
        return val.id == trademarkId.value;
      });
      if (tr?.name) {
        return "Пекарни " + tr.name + " - " + bakeryRows.value.length + " шт.";
      } else {
        return "Пекарни";
      }
    });
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    const { bakerySelectedRow, bakeryRows, trademarkRows, trademarkId } =
      storeToRefs(useSaleStore());
    const pagination = ref({
      rowsPerPage: 10,
    });

    function onRowClick(row) {
      console.log("Нажали по строке", row);
      bakerySelectedRow.value = row;
    }
    return {
      bakeryRows,
      bakerySelectedRow,
      pagination,
      columns,
      tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick,
      titleTable,
    };
  },
});
</script>

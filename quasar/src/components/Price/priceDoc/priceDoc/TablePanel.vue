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
    :title="title"
    :tableName="tableName"
    :rows="RowsDocuments"
    :columns="columns"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="$emit('onRowDblClick')"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onRowDblClick="$emit('onRowDblClick')"
    @onAdd="onRowClick"
    :currentRow="selectedRowDoc"
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
  onMounted,
  watch,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns } from "./tableColumnList.js";

import { usePriceStore, storeToRefs } from "stores/priceStore.js";

export default defineComponent({
  name: "TablePanel",
  components: {
    TableTemplate: defineAsyncComponent(() =>
      import("src/components/template/table/TableTemplate.vue")
    ),
  },
  props: {
    modeBody: {
      type: String,
      default: "view",
    },
    tableName: {
      type: String,
      default: "tabPrice", // для запроса с сервера
    },
    title: {
      type: String,
      default: "Документы",
    },
    checkSave: Boolean,
    panelName: String,
  },
  emits: [""],
  setup(props, { emit }) {
    const tableFunc = useTableFunc(props.tableName);
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    const priceStore = usePriceStore();
    const { RowsDocuments, selectedRowDoc } = storeToRefs(usePriceStore());
    const pagination = ref({
      rowsPerPage: 10,
    });
    async function loadTable() {
      // при обновлениитаблицы будем пеерчитывать выбранную строку
      await tableFunc.loadTable();
    }
    priceStore.watchStore(() => {
      return watch(
        // сигнал на перезагрузку таблицы
        () => props.checkSave,
        async () => {
          await loadTable();
        }
      );
    });
    onMounted(async () => {
      await loadTable();
    });
    return {
      //    currentRow,
      selectedRowDoc,
      priceStore,
      pagination,
      RowsDocuments,
      columns,
      tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        selectedRowDoc.value = row;
        //    priceStore.selectedRowDoc = row;
        //  emit("selectedRow", row); //! необходимо отдать для Sprav ? да и ваще полезно
      },
    };
  },
});
</script>

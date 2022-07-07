<!--
    :rows="rows" - [] строки таблицы
    :columns="columns" [] - колонки 
    :columnsVisibleTemplate="columnsVisibleTemplate" [] - какие показываь колонки, а какие в выбор оставить
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
    :rows="rows"
    :columns="columns"
    :columnsVisibleTemplate="columnsVisibleTemplate"
    :tableBodyMenu="tableBodyMenu"
    :tableFunc="tableFunc"
    @onInfoRow="onInfoRow"
    @onBtnDelete="onInfoRow"
    @onBtnEdit="onInfoRow"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    :currentRow="currentRow"
    noExpandPanel
    noEditTable
    :store="store"
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
  watchEffect,
} from "vue";
import { useTableFunc } from "./tableFunc.js";
import { columns, columnsVisibleTemplate } from "./tableColumnList.js";
import { useBakeryStore } from "stores/bakeryStore.js";
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
    tableName: String,
    title: String,
    panelName: String,
  },
  emits: [""],
  setup(props) {
    const tableFunc = useTableFunc(props.tableName);
    const tableBodyMenu = defineAsyncComponent(() => {
      return import("./TableBodyMenu.vue");
    });
    const store = useBakeryStore();
    const rows = ref([]);
    const currentRow = ref({});
    const pagination = ref({
      rowsPerPage: 10,
    });
    function reLoadComponent() {}
    watchEffect(() => {
      reLoadComponent(props.panelName);
    });

    onMounted(async () => {
      rows.value = await tableFunc.loadTable();
    });
    return {
      currentRow,
      store,
      pagination,
      rows,
      columns,
      columnsVisibleTemplate,
      tableBodyMenu,
      tableFunc,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick(row) {
        console.log("Нажали по строке");
        currentRow.value = row;
        store.selectedRow = row;
      },
    };
  },
});
</script>

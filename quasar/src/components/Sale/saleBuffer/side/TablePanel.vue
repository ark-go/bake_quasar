<!--
    :tableName="tableName" - имя таблицы для обслуживания
    :rows="rows" - [] строки таблицы
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
    @refTable="(val) => (refTable = val)"
    title="ху"
    :rows="rows"
    @onInfoRow="$emit('onRowDblClick')"
    @onRowClick="onRowClick"
    @onAdd="onRowClick"
    @onRowDblClick="$emit('onRowDblClick')"
    noExpandPanel
    noEditTable
    :rowsPerPage="0"
    v-model:pagination="pagination"
    noInfoBtn
    noTitlePanel
  >
  </Table-Template>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  reactive,
  onMounted,
  watch,
  watchEffect,
  onUnmounted,
} from "vue";
//import { useTableFunc } from "./tableFunc.js";
//import { useSaleStore, storeToRefs } from "stores/saleStore.js";

export default defineComponent({
  name: "TablePanel",
  components: {
    TableTemplate: defineAsyncComponent(() => {
      return import("src/components/template/table/TableTemplate.vue");
    }),
  },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
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
    // const tableFunc = useTableFunc(props.tableName);
    const refTable = ref(null);
    const columnsReact = ref([]);

    const pagination = ref({
      rowsPerPage: 0,
    });
    watch(
      () => props.rows,
      () => {
        console.log("FFFFFFFFFFF", props.rows);
      }
    );
    function onRowClick(row) {
      console.log("Нажали по строке2", row);
    }
    function currentRow(val) {
      console.log("DDDDDD", val);
    }
    onUnmounted(() => {
      console.log("unmount manual");
    });
    return {
      pagination,
      columnsReact,
      onInfoRow(row) {
        console.log("info butt", row);
      },
      onRowClick,
      refTable,
      currentRow,
    };
  },
});
</script>
